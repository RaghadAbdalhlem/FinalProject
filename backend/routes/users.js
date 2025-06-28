const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/personal/me', authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send({
            user,
            message: 'User details retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).send({
            message: error.message
        });
    }
});

router.get('/logout', async (req, res) => {
    try {
        // Clear the refresh token cookie and login status
        res.cookie('refreshToken', '', {
            httpOnly: true, // Prevent client-side access to the cookie
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict', // Mitigate CSRF attacks
            maxAge: 0, // Immediately expires the cookie
        });

        res.cookie('isLoggedIn', '', {
            httpOnly: false, // Client-side access is allowed for UI handling
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 0,
        });

        return res.status(200).send({
            status: 'success',
            message: 'Successfully logged out',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).send({
            status: 'error',
            message: 'Internal server error while logging out',
        });
    }
});

// Create a new User
router.post("/create", authMiddleware(['admin']), async (req, res) => {
    try {
        const { fullName, email, password, role, status } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            status
        });

        await newUser.save();
        return res.status(201).json({ status: "success", message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
});

// Get All Users
router.get("/", authMiddleware(['admin']), async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get Single User by ID
router.get("/getOne/:id", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update a User by ID
router.put("/update/:id", authMiddleware(['admin', 'content-manager']), async (req, res) => {
    try {
        const { fullName, email, password, age, height, weight, dietPreference, goal, role, status } = req.body;
        const { id } = req.params;

        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (password) updatedData.password = await bcrypt.hash(password, 12);  // Ensure the password is hashed
        if (status) updatedData.status = status;
        if (age) updatedData.age = age;
        if (height) updatedData.height = height;
        if (weight) updatedData.weight = weight;
        if (dietPreference) updatedData.dietPreference = dietPreference;
        if (goal) updatedData.goal = goal;
        if (role) updatedData.role = role;

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({ status: "success", message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.delete("/delete/:id", authMiddleware(['admin', 'content-manager']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Block a User by ID
router.patch("/block/:id", authMiddleware(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        return res.status(200).json({ status: "success", message: "User blocked successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Unblock a User by ID
router.patch("/unblock/:id", authMiddleware(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        return res.status(200).json({ status: "success", message: "User unblocked successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/updateProfile", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
    try {
        const { email, fullName, age, height, weight, dietPreference, goal, gender } = req.body;
        const userId = req.user._id;

        // Check if the new email is already in use by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ status: "error", message: "Email is already taken" });
            }
        }

        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (gender) updatedData.gender = gender;
        if (age) updatedData.age = age;
        if (height) updatedData.height = height;
        if (weight) updatedData.weight = weight;
        if (dietPreference) updatedData.dietPreference = dietPreference;
        if (goal) updatedData.goal = goal;

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({ status: "success", message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
});

router.post("/change-password", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id; // Get user ID from auth middleware

        // Find user in database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password using findOneAndUpdate
        await User.findOneAndUpdate(
            { _id: userId }, // Find user by ID
            { password: hashedPassword }, // Update password field
            { new: true } // Return updated user
        );

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;