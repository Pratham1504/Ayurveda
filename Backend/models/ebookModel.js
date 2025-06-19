const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fileUrl : {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const Ebook = mongoose.model('Ebook', ebookSchema);
module.exports = Ebook;
