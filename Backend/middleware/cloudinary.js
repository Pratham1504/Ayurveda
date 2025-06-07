const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_APIKEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_APISECRET 
});

const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath); // delete local file after upload
        return response;

    } catch (error) {
        console.error(error);
        fs.unlinkSync(localFilePath); // remove even on failure
        return null;
    }
};

module.exports = { uploadFile };
