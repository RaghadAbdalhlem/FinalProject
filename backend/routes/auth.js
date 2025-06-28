const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sgMail = require('@sendgrid/mail');

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let refreshTokens = [];

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '30d',
};

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Check if the email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).send({ message: "Email already exists in the system." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(authConfig.saltLength || 10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const userData = {
            fullName,
            email,
            password: hashPassword,
            role,
        };

        // Save the new user
        const user = new User(userData);
        const savedUser = await user.save();

        // Generate an access token
        const accessToken = jwt.sign(
            { _id: savedUser._id, role: savedUser.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: authConfig.expireTime || '1d' }
        );

        // Remove password from the response
        const responseUser = { ...savedUser._doc };
        delete responseUser.password;

        return res.status(201).send({
            user: responseUser,
            accessToken,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send({ message: 'Server error occurred while registering.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Find the user by email and update the last login timestamp
        const user = await User.findOneAndUpdate(
            { email },
            { lastLogin: new Date() },
            { new: true }
        ).select('-__v');
        // Check if the user exists
        if (!user) {
            return res.status(400).send({ message: "The email does not exist in the system." });
        }

        if (user.role === "admin") {
            return res.status(403).send({ message: "Permission Denied." });
        };

        if (user.status !== "active") {
            return res.status(403).send({ message: "Account is not active, Please ask to support team." });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: "Email or password is incorrect." });
        }

        // Determine token expiry based on "remember me" option
        const tokenExpiry = remember ? '30d' : authConfig.expireTime || '1d';

        // Generate access token and refresh token
        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );

        const refreshToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '30d' }
        );

        // Store the refresh token securely
        refreshTokens.push(refreshToken); 

        // Remove sensitive data from the response
        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Set cookies for tokens
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        };

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        res.cookie('isLoggedIn', true, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Send the response
        return res.status(200).send({
            userData: userResponse,
            accessToken,
            refreshToken,
            message: 'Login successful.',
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send({ message: error.message });
    }
});

router.post('/admin-login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Find the user by email and update the last login timestamp
        const user = await User.findOneAndUpdate(
            { email },
            { lastLogin: new Date() },
            { new: true }
        ).select('-__v');

        // Check if the user exists
        if (!user) {
            return res.status(400).send({ message: "The email does not exist in the system." });
        }

        if (user.status === "blocked") {
            return res.status(403).send({ message: "Your account is blocked. Please contact support." });
        }

        if (user.role !== "admin") {
            return res.status(403).send({ message: "You can't access admin page with your role." });
        };

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: "Email or password is incorrect." });
        }

        // Determine token expiry based on "remember me" option
        const tokenExpiry = remember ? '30d' : authConfig.expireTime || '1d';

        // Generate access token and refresh token
        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );

        const refreshToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '30d' }
        );

        // Store the refresh token securely
        refreshTokens.push(refreshToken); // Replace with a secure storage mechanism (e.g., database)

        // Remove sensitive data from the response
        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Set cookies for tokens
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        };

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        res.cookie('isLoggedIn', true, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Send the response
        return res.status(200).send({
            userData: userResponse,
            accessToken,
            refreshToken,
            message: 'Login successful.',
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send({ message: 'An error occurred during login. Please try again.' });
    }
});

router.get('/refreshToken', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh token not provided' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { _id } = decoded;

        // Fetch the user data
        const userData = await User.findById(_id).select('-__v -password');
        if (!userData) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate new access and refresh tokens
        const newAccessToken = jwt.sign(
            { _id: userData._id, role: userData.role },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: authConfig.expireTime || '1h' }
        );
        const newRefreshToken = jwt.sign(
            { _id: userData._id, role: userData.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: authConfig.refreshTokenExpireTime || '30d' }
        );

        // Securely set the new refresh token in cookies
        const cookieOptions = {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        };

        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        // Return the new tokens and user data
        return res.status(200).send({
            user: userData,
            accessToken: newAccessToken,
            message: 'Token refreshed successfully',
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(401).send({ message: 'Invalid or expired refresh token' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        // Create a reset token (using JWT)
        const resetToken = jwt.sign({ id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1h' });

        // Set the reset token and its expiration time
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

        // Save the user with the token
        await user.save();

        // Create the reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send the reset link to the user's email using SendGrid
        const msg = {
            to: email,
            from: process.env.SENDER_EMAIL,
            subject: 'Password Reset Request',
            html: `<p>To reset your password, click the following link: <a href="${resetLink}">${resetLink}</a></p>`,
        };

        await sgMail.send(msg);

        return res.status(200).json({ message: 'Password reset link has been sent to your email.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password endpoint
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Reset token is invalid or has expired' });
        }

        // Hash the new password and update it
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = undefined; // Remove the reset token
        user.resetPasswordExpires = undefined; // Remove the expiration

        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});

module.exports = router;