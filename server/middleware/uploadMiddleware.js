const multer = require('multer');
const path = require('path');

// Use memory storage so uploaded files are available as buffers.
// In production (Vercel) we upload buffers to Cloudinary/S3 instead
// of writing to disk in the serverless environment.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file) {
        return cb(null, true);
    }

    const filetypes = /jpg|jpeg|png|webp|gif|heic|heif/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype && file.mimetype.startsWith('image/');

    if (extname || mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only! Allowed formats: JPG, JPEG, PNG, WEBP, GIF, HEIC.'));
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
