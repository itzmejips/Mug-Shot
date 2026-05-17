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
        
        // Find existing to get old photo path
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const updateFields = {
            name: name || menuItem.name,
            description: description || menuItem.description,
            price: price || menuItem.price,
            category: category || menuItem.category
        };

        if (req.file) {
            // Delete old photo if it exists
            if (menuItem.photoUrl) {
                const oldPath = path.join(__dirname, '..', menuItem.photoUrl.replace(/^\//, ''));
                if (fs.existsSync(oldPath) && fs.lstatSync(oldPath).isFile()) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateFields.photoUrl = `/uploads/${req.file.filename}`;
        }

        // Based on studied code: findByIdAndUpdate() with returnDocument: 'after'
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { returnDocument: 'after' }
        );

        res.json(updatedItem);
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
        // Based on studied code: findByIdAndDelete()
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (deletedItem) {
            // Delete physical file
            if (deletedItem.photoUrl) {
                const photoPath = path.join(__dirname, '..', deletedItem.photoUrl.replace(/^\//, ''));
                if (fs.existsSync(photoPath) && fs.lstatSync(photoPath).isFile()) {
                    fs.unlinkSync(photoPath);
                }
            }
            res.json({ message: 'Menu item removed', item: deletedItem });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
