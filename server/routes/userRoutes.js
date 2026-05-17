const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// @route   GET /api/users
// @desc    Get all admin users
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users
// @desc    Create an admin user
// @access  Private
router.post('/', protect, async (req, res) => {
    const { username, password, name, email } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, password, name, email });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete an admin user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user (password)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.username = req.body.username || user.username;
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.email = req.body.email !== undefined ? req.body.email : user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                name: updatedUser.name,
                email: updatedUser.email
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
