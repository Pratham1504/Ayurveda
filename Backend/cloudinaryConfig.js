require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME); // Check if this is undefined

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Make sure this folder exists
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage });
module.exports = cloudinary;
