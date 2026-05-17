const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            console.warn('Auth attempt: No token provided');
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            console.warn('Auth attempt: User not found for token');
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
};

module.exports = { protect };
