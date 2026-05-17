const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String },
    // GridFS file id when stored in MongoDB
    photoId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
