const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all admin users
// @access  Public (simplified without JWT)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/users
// @desc    Create an admin user
// @access  Public (simplified without JWT)
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const nameRegex = /^[A-Za-z\s-]+$/;
        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({ message: 'Name must only contain alphabets, spaces, and hyphens (no numbers).' });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: 'Invalid email address format' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const userExists = await User.findOne({ email: email.trim() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password
        });
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password
        });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete an admin user
// @access  Public (simplified without JWT)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'User ID is required and must be valid' });
        }

        // Based on studied code: findByIdAndDelete()
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
            res.json({ message: 'User removed', user: deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Public (simplified without JWT)
router.put('/:id', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'User ID is required and must be valid' });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ message: 'Name cannot be empty' });
            }
            const nameRegex = /^[A-Za-z\s-]+$/;
            if (!nameRegex.test(name.trim())) {
                return res.status(400).json({ message: 'Name must only contain alphabets, spaces, and hyphens (no numbers).' });
            }
        }

        if (email !== undefined) {
            if (!email.trim()) {
                return res.status(400).json({ message: 'Email cannot be empty' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                return res.status(400).json({ message: 'Invalid email address format' });
            }
            // Check if email already exists for another user
            const emailExists = await User.findOne({ email: email.trim(), _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use by another user' });
            }
        }

        if (password !== undefined && password !== '') {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name.trim();
        if (email !== undefined) updateFields.email = email.trim();
        if (password !== undefined && password !== '') {
            updateFields.password = password;
        }

        // Based on studied code: findByIdAndUpdate() with returnDocument: 'after'
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { returnDocument: 'after' }
        );

        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                password: updatedUser.password
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
