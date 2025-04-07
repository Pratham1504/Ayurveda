const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const DatauriParser = require('datauri/parser'); // To convert buffer to data URI format

const parser = new DatauriParser();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file upload
const storage = multer.memoryStorage(); // We are storing file in memory temporarily

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10 MB
});

// Helper function to convert buffer to Data URI
const formatBufferTo64 = (file) => parser.format(path.extname(file.originalname).toString(), file.buffer);

// Middleware to upload file to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const file64 = formatBufferTo64(req.file);
        const result = await cloudinary.uploader.upload(file64.content, {
            resource_type: 'auto',
            folder: 'ebooks', // Cloudinary folder to store ebooks
            public_id: uuidv4(),
        });

        // Attach the Cloudinary URL and filename to the request object
        req.file.path = result.secure_url; // Cloudinary file URL
        req.file.filename = result.public_id; // Cloudinary file ID

        next();
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ error: 'Cloudinary upload failed' });
    }
};

module.exports = { upload, uploadToCloudinary };
