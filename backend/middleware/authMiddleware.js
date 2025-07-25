const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (userRolesAllowed) => async function auth(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) return res.status(403).send({ message: 'Access denied. Please check your API token' });
        try {
            const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
            req.user = verified;

            let user;
            user = await User.findOne({ _id: req.user._id }).select('fullName role');
            req.user.role = user.role;
            req.user.fullName = user.fullName;
            if ((userRolesAllowed) && (!userRolesAllowed.includes(user.role))) {
                return res.status(403).send({ message: 'You do not have permission to run this request' });
            }
            next();
        } catch (err) {
            res.status(401).send({ message: 'Invalid or expired auth token' });
        }
    } else {
        return res.status(401).json({ message: 'Malformed or unauthenticated auth token' });
    }
};
