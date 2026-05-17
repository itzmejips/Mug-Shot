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
        if (!email || !name || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Based on studied code: new User() and save()
        const newUser = new User({ name, email, password });
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

        const updateFields = { name, email };
        if (password) {
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
