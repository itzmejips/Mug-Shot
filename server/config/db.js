const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('MONGO_URI is undefined! Please configure it in your Vercel Environment Variables.');
            return;
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

module.exports = connectDB;
