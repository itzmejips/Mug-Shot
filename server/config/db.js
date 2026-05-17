const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is undefined! Please configure it in your Vercel Environment Variables.');
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Don't silently fail - let the error propagate
        throw error;
    }
};

module.exports = connectDB;
