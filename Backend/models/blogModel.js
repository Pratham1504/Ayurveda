const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 1
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 500000, // Allow longer descriptions, up to 5000 characters
    },
    topic: {
        type: String,
        required: true,
        trim: true,
    },
    youtubeLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v); // Validate YouTube link format
            },
            message: props => `${props.value} is not a valid YouTube URL!`,
        },
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductModel', // Reference the Product model
        required: false, // Make it optional since not all blogs will have an associated product
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema], // Array of comments
}, {
    timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
