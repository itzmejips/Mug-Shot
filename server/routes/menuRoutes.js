const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const upload = require('../middleware/uploadMiddleware');
const rateLimit = require('express-rate-limit');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// rate limit: 10 requests per minute per IP for upload routes
const uploadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// Persistent uploads directory (in server root for local dev fallback)
const persistentUploadsDir = path.join(__dirname, '..', 'uploads');
const ensureUploadsDir = () => {
    const fs = require('fs');
    try {
        if (!fs.existsSync(persistentUploadsDir)) fs.mkdirSync(persistentUploadsDir, { recursive: true });
    } catch (err) {
        console.warn('Could not create uploads dir in route:', err.message);
    }
};

// Helper function to upload file to Cloudinary, with local fallback
const uploadImage = async (file) => {
    if (!file || !file.buffer) return '';

    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    if (isCloudinaryConfigured) {
        console.log('Uploading image to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'mugshot_menu' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });
        console.log('Uploaded to Cloudinary successfully:', result.secure_url);
        return result.secure_url;
    } else {
        console.warn('Cloudinary environment variables missing. Falling back to local disk storage.');
        try {
            ensureUploadsDir();
            const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
            const filePath = path.join(persistentUploadsDir, filename);
            require('fs').writeFileSync(filePath, file.buffer);
            return `/uploads/${filename}`;
        } catch (writeError) {
            console.error('Failed to write file locally:', writeError.message);
            if (writeError.code === 'EROFS' || writeError.message.includes('read-only') || writeError.message.includes('EROFS')) {
                throw new Error('Cloudinary credentials are not configured in Vercel. Vercel utilizes a read-only filesystem, so images cannot be saved locally. Please configure your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Vercel Environment Variables.');
            }
            throw writeError;
        }
    }
};

const deleteImage = async (photoUrl) => {
    if (!photoUrl) return;

    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    if (isCloudinaryConfigured && photoUrl.includes('res.cloudinary.com')) {
        try {
            const parts = photoUrl.split('/image/upload/');
            if (parts.length > 1) {
                const relativePath = parts[1].replace(/^v\d+\//, ''); // remove version number
                const publicId = relativePath.substring(0, relativePath.lastIndexOf('.')); // remove file extension
                console.log('Deleting image from Cloudinary, public_id:', publicId);
                await cloudinary.uploader.destroy(publicId);
                console.log('Deleted successfully from Cloudinary.');
            }
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error.message);
        }
    } else if (photoUrl.startsWith('/uploads/')) {
        try {
            const fs = require('fs');
            const filePath = path.join(__dirname, '..', photoUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('Deleted local image:', filePath);
            }
        } catch (error) {
            console.error('Error deleting local file:', error.message);
        }
    }
};

router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        console.error('Menu Fetch Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.post('/', uploadLimiter, upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /api/menu - Received request');
        console.log('Body:', req.body);
        console.log('File:', req.file ? { name: req.file.originalname, size: req.file.size } : 'No file');

        const { name, description, price, category } = req.body;
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

        const photoUrl = await uploadImage(req.file);

        const menuItem = new MenuItem({ name, description, price, category, photoUrl });
        const createdItem = await menuItem.save();
        console.log('Menu item created:', createdItem._id);
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Menu Post Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
    }
});

router.put('/:id', uploadLimiter, upload.single('photo'), async (req, res) => {
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

        if (req.body.removePhoto === 'true') {
            await deleteImage(menuItem.photoUrl);
            updateFields.photoUrl = '';
        } else if (req.file && req.file.buffer) {
            await deleteImage(menuItem.photoUrl);
            updateFields.photoUrl = await uploadImage(req.file);
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
router.delete('/:id', uploadLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Menu Item ID is required and must be valid' });
        }
        // Delete from DB and clean up image asset
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        if (deletedItem) {
            await deleteImage(deletedItem.photoUrl);
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
