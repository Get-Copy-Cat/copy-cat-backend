const mongoose = require('mongoose');

const WordCountSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WordCount', WordCountSchema);
