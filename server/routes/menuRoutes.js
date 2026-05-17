const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables (set these in Vercel)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const os = require('os');
const path = require('path');
const cloudConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

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
            if (!cloudConfigured) {
                console.warn('Cloudinary not configured — received file; saving to tmp uploads.');
                ensureTmpUploadsDir();
                const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
                const filePath = path.join(tmpUploadsDir, filename);
                require('fs').writeFileSync(filePath, req.file.buffer);
                // Expose via /uploads route
                photoUrl = `/uploads/${filename}`;
            } else {
                // Upload buffer to Cloudinary using data URI
                const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                const uploadRes = await cloudinary.uploader.upload(dataUri, { folder: 'mugshot_menu' });
                photoUrl = uploadRes.secure_url;
            }
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
            if (!cloudConfigured) {
                console.warn('Cloudinary not configured — received file on update; saving to tmp uploads.');
                ensureTmpUploadsDir();
                const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
                const filePath = path.join(tmpUploadsDir, filename);
                require('fs').writeFileSync(filePath, req.file.buffer);
                updateFields.photoUrl = `/uploads/${filename}`;
            } else {
                const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                const uploadRes = await cloudinary.uploader.upload(dataUri, { folder: 'mugshot_menu' });
                updateFields.photoUrl = uploadRes.secure_url;
            }
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
