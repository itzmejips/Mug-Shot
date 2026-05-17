const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/menu
// @desc    Create a menu item
// @access  Private
router.post('/', protect, upload.single('photo'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            photoUrl
        });

        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Menu post error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Private
router.put('/:id', protect, upload.single('photo'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price || menuItem.price;
            menuItem.category = category || menuItem.category;
            if (req.file) {
                // Delete old photo if it exists
                if (menuItem.photoUrl) {
                    const oldPath = path.join(__dirname, '..', menuItem.photoUrl.replace(/^\//, ''));
                    if (fs.existsSync(oldPath) && fs.lstatSync(oldPath).isFile()) {
                        fs.unlinkSync(oldPath);
                    }
                }
                menuItem.photoUrl = `/uploads/${req.file.filename}`;
            }

            const updatedItem = await menuItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        console.error('Menu put error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            // Delete physical file
            if (menuItem.photoUrl) {
                const photoPath = path.join(__dirname, '..', menuItem.photoUrl.replace(/^\//, ''));
                if (fs.existsSync(photoPath) && fs.lstatSync(photoPath).isFile()) {
                    fs.unlinkSync(photoPath);
                }
            }
            await menuItem.deleteOne();
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
