const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    password: { type: String, required: true }
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
    return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
