const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    state: { type: String, },
    interests: { type: [String], default: [] },
    coins: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    payoutHistory: [{
        amount: Number,
        method: String,
        details: String,
        status: { type: String, default: 'Pending' },
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
