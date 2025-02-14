// models/Click.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clickSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clickedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Click', clickSchema);
