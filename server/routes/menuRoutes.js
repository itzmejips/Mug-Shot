const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const upload = require('../middleware/uploadMiddleware');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');

// rate limit: 10 requests per minute per IP for upload routes
const uploadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });


const path = require('path');
// Cloudinary removed; rely on Supabase or tmp fallback

// No external storage configured — use persistent uploads directory fallback

// Persistent uploads directory (in server root for local dev)
const persistentUploadsDir = path.join(__dirname, '..', 'uploads');
const ensureUploadsDir = () => {
    const fs = require('fs');
    try {
        if (!fs.existsSync(persistentUploadsDir)) fs.mkdirSync(persistentUploadsDir, { recursive: true });
    } catch (err) {
        console.warn('Could not create uploads dir in route:', err.message);
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
router.post('/', uploadLimiter, protect, upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /api/menu - Received request');
        console.log('User:', req.user ? req.user._id : 'No user');
        console.log('Body:', req.body);
        console.log('File:', req.file ? { name: req.file.originalname, size: req.file.size } : 'No file');
        
        const { name, description, price, category } = req.body;
        // Basic validation
        if (!name || typeof name !== 'string') {
            console.warn('Validation failed: Name is required');
            return res.status(400).json({ message: 'Name is required' });
        }
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            console.warn('Validation failed: Invalid price');
            return res.status(400).json({ message: 'Price must be a non-negative number' });
        }
        if (!category || typeof category !== 'string') {
            console.warn('Validation failed: Category is required');
            return res.status(400).json({ message: 'Category is required' });
        }

        let photoUrl = '';
        if (req.file && req.file.buffer) {
            console.log('Processing file upload:', req.file.originalname);
            ensureUploadsDir();
            const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
            const filePath = path.join(persistentUploadsDir, filename);
            require('fs').writeFileSync(filePath, req.file.buffer);
            photoUrl = `/uploads/${filename}`;
            console.log('File saved locally:', photoUrl);
        }

        const menuItem = new MenuItem({ name, description, price, category, photoUrl });
        const createdItem = await menuItem.save();
        console.log('Menu item created:', createdItem._id);
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Menu Post Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Public (simplified without JWT)
router.put('/:id', uploadLimiter, protect, upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Menu Item ID is required and must be valid' });
        }

        const { name, description, price, category } = req.body;
        if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) return res.status(400).json({ message: 'Price must be a non-negative number' });
        
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
            ensureUploadsDir();
            const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
            const filePath = path.join(persistentUploadsDir, filename);
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
router.delete('/:id', uploadLimiter, protect, async (req, res) => {
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
