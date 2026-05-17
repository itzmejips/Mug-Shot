const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const upload = require('../middleware/uploadMiddleware');


const os = require('os');
const path = require('path');
// Cloudinary removed; rely on Supabase or tmp fallback

// No external storage configured — use tmp uploads fallback only

// Temp uploads directory (matching index.js)
const tmpUploadsDir = path.join(os.tmpdir(), 'mugshot_uploads');
const ensureTmpUploadsDir = () => {
    const fs = require('fs');
    try {
        if (!fs.existsSync(tmpUploadsDir)) fs.mkdirSync(tmpUploadsDir, { recursive: true });
    } catch (err) {
        console.warn('Could not create tmp uploads dir in route:', err.message);
    }
};

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        console.error('Menu Fetch Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/menu
// @desc    Create a menu item
// @access  Public (simplified without JWT)
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        let photoUrl = '';
        if (req.file && req.file.buffer) {
            // Save to tmp uploads directory (no external storage configured)
            ensureTmpUploadsDir();
            const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
            const filePath = path.join(tmpUploadsDir, filename);
            require('fs').writeFileSync(filePath, req.file.buffer);
            // Expose via /uploads route
            photoUrl = `/uploads/${filename}`;
        }

        const menuItem = new MenuItem({ name, description, price, category, photoUrl });
        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Menu Post Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Public (simplified without JWT)
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Menu Item ID is required and must be valid' });
        }

        const { name, description, price, category } = req.body;
        
        // Find existing to use as fallback
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        const updateFields = {
            name: name || menuItem.name,
            description: description || menuItem.description,
            price: price || menuItem.price,
            category: category || menuItem.category
        };

        if (req.file && req.file.buffer) {
            // Save updated file to tmp uploads directory
            ensureTmpUploadsDir();
            const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
            const filePath = path.join(tmpUploadsDir, filename);
            require('fs').writeFileSync(filePath, req.file.buffer);
            updateFields.photoUrl = `/uploads/${filename}`;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateFields, { returnDocument: 'after' });
        res.json(updatedItem);
    } catch (error) {
        console.error('Menu Put Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Public (simplified without JWT)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Menu Item ID is required and must be valid' });
        }
        // Delete from DB. If images are hosted externally, we do not attempt to
        // delete them here unless we stored a provider id.
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        if (deletedItem) {
            res.json({ message: 'Menu item removed', item: deletedItem });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        console.error('Menu Delete Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
