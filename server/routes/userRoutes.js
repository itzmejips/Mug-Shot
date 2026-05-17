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
        
        // Based on studied code: new User() and save()
        const newUser = new User({ username, password, name, email });
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            name: newUser.name,
            email: newUser.email
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
        // Based on studied code: findByIdAndDelete()
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.json({ message: 'User removed', user: deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { username, password, name, email } = req.body;
    try {
        const updateFields = { username, name, email };
        if (password) {
            updateFields.password = password;
        }

        // Based on studied code: findByIdAndUpdate() with returnDocument: 'after'
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            updateFields, 
            { returnDocument: 'after' }
        );

        if (updatedUser) {
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
