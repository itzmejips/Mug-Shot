const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const upload = require('../middleware/uploadMiddleware');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');

// rate limit: 10 requests per minute per IP for upload routes
const uploadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });


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

// stream image stored in GridFS
router.get('/photo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Photo id required' });
        const fileId = new ObjectId(id);
        const db = mongoose.connection.db;
        const filesColl = db.collection('menu_images.files');
        const fileDoc = await filesColl.findOne({ _id: fileId });
        if (!fileDoc) return res.status(404).json({ message: 'Image not found' });

        // Allow cross-origin embedding of images (fixes ERR_BLOCKED_BY_ORB)
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
        res.set('Content-Length', fileDoc.length);
        // Encourage caching for images
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menu_images' });
        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.on('error', (err) => {
            console.error('GridFS download error', err);
            res.status(500).end();
        });
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Photo stream error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Handle preflight CORS requests for photo endpoint
router.options('/photo/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.sendStatus(200);
});

// @route   POST /api/menu
// @desc    Create a menu item
// @access  Public (simplified without JWT)
router.post('/', uploadLimiter, protect, upload.single('photo'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        // Basic validation
        if (!name || typeof name !== 'string') return res.status(400).json({ message: 'Name is required' });
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) return res.status(400).json({ message: 'Price must be a non-negative number' });
        if (!category || typeof category !== 'string') return res.status(400).json({ message: 'Category is required' });

        let photoUrl = '';
        let photoId = null;
        if (req.file && req.file.buffer) {
            // Try storing in GridFS
            try {
                const db = mongoose.connection.db;
                const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menu_images' });
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype });
                    uploadStream.on('error', reject);
                    uploadStream.on('finish', resolve);
                    uploadStream.end(req.file.buffer);
                });
                photoId = uploadResult._id;
                photoUrl = `/api/menu/photo/${photoId.toString()}`;
            } catch (err) {
                console.warn('GridFS upload failed, falling back to tmp file:', err.message || err);
                ensureTmpUploadsDir();
                const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
                const filePath = path.join(tmpUploadsDir, filename);
                require('fs').writeFileSync(filePath, req.file.buffer);
                photoUrl = `/uploads/${filename}`;
            }
        }

        const menuItem = new MenuItem({ name, description, price, category, photoUrl, photoId });
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
            // If existing GridFS file present, attempt to delete it
            try {
                if (menuItem.photoId) {
                    const db = mongoose.connection.db;
                    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menu_images' });
                    await bucket.delete(new ObjectId(menuItem.photoId));
                }
            } catch (err) {
                console.warn('Failed to delete old GridFS file:', err.message || err);
            }

            try {
                const db = mongoose.connection.db;
                const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menu_images' });
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype });
                    uploadStream.on('error', reject);
                    uploadStream.on('finish', resolve);
                    uploadStream.end(req.file.buffer);
                });
                updateFields.photoId = uploadResult._id;
                updateFields.photoUrl = `/api/menu/photo/${uploadResult._id.toString()}`;
            } catch (err) {
                console.warn('GridFS upload failed on update, falling back to tmp file:', err.message || err);
                ensureTmpUploadsDir();
                const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
                const filePath = path.join(tmpUploadsDir, filename);
                require('fs').writeFileSync(filePath, req.file.buffer);
                updateFields.photoUrl = `/uploads/${filename}`;
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
            // Attempt to remove GridFS file if present
            try {
                if (deletedItem.photoId) {
                    const db = mongoose.connection.db;
                    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menu_images' });
                    await bucket.delete(new ObjectId(deletedItem.photoId));
                }
            } catch (err) {
                console.warn('Failed to remove GridFS file during delete:', err.message || err);
            }

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
