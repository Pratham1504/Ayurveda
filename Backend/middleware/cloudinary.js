const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (localFilePath) => {
    try {
        console.log("aaya")
        if (!localFilePath) return null;
        console.log("localFilePath", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("response", response);
        console.log("File uploaded and local copy deleted successfully");
        return response;

    } catch (error) {
        console.error(error);
         
        return null;
    }
    finally{
        fs.unlinkSync(localFilePath); // remove even on failure
        console.log("Local file deleted successfully");
    }
};

module.exports = { uploadFile };
