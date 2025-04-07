const Ebook = require('../models/ebookModel');
const fs = require('fs');
const path = require('path');
const B2 = require('backblaze-b2');
require('dotenv').config();

const b2 = new B2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
});

// Function to upload the file to B2
// Function to upload the file to B2
const uploadToB2 = async (filePath, fileName) => {
    try {
        // Authorize
        await b2.authorize();
        console.log('Authorization successful');

        // Read the file into a buffer
        const fileBuffer = fs.readFileSync(filePath);
        console.log("File read successfully.");

        // Ensure bucket ID is correct
        const bucketId = process.env.BACKBLAZE_BUCKET_ID; // Use your environment variable for bucket ID

        // Get upload URL
        const uploadUrlResponse = await b2.getUploadUrl({ bucketId });
        const uploadUrl = uploadUrlResponse.data.uploadUrl;
        const uploadAuthToken = uploadUrlResponse.data.authorizationToken;
        console.log('Upload URL:', uploadUrl);

        // Upload the file using the Buffer
        const response = await b2.uploadFile({
            uploadUrl,
            uploadAuthToken,
            fileName: fileName, // Use the provided file name
            data: fileBuffer, // Pass the file as a buffer
            contentType: 'application/pdf', // Adjust as necessary
        });

        console.log('Upload response:', response.data);
        
        // Check if the response has a valid URL
        if (response.data && response.data.fileId) {
            const fileUrl = `https://f002.backblazeb2.com/file/${bucketId}/${fileName}`;
            console.log('File uploaded successfully:', fileUrl);
            return { fileUrl, fileId: response.data.fileId }; // Return the URL and fileId
        } else {
            throw new Error('No fileId in the response:', response.data);
        }
    } catch (error) {
        console.error('Error uploading file to B2:', error.response ? error.response.data : error.message);
        throw new Error('Failed to upload file to Backblaze B2');
    }
};


// Create ebook function
const createEbook = async (req, res) => {
    try {
        const { title, author, description } = req.body;
        const file = req.file;

        // Validate input
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Upload to Backblaze B2
        const { fileUrl, fileId } = await uploadToB2(file.path, file.originalname); // Call the upload function

        // Save ebook information to the database
        const ebook = new Ebook({
            title,
            author,
            description,
            fileName: file.originalname,
            url: fileUrl, // URL from Backblaze
            fileId: fileId // Include the fileId from the upload response
        });
        await ebook.save();

        return res.status(201).json(ebook);
    } catch (error) {
        console.error("Error creating ebook:", error);
        return res.status(500).json({ message: 'Failed to create ebook.' });
    }
};


// Get all eBooks
async function getAllEbooks(req, res) {
    try {
        const ebooks = await Ebook.find();
        res.status(200).json(ebooks);
    } catch (error) {
        console.error('Error fetching eBooks:', error);
        res.status(500).json({ message: 'Error fetching eBooks', error });
    }
}

// Download eBook from B2
async function downloadEbook(req, res) {
    const { fileName } = req.params;

    try {
        // Authorize with Backblaze B2
        const authData = await getB2AuthToken();

        // Construct the download URL
        const downloadUrl = `${authData.downloadUrl}/file/${process.env.BACKBLAZE_BUCKET_NAME}/${fileName}`;

        // Fetch the file as an array buffer
        const downloadResponse = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'arraybuffer', // Important: Set the response type
            headers: {
                Authorization: authData.authorizationToken, // Use the generated token
            },
        });

        // Check if the response status is OK
        if (downloadResponse.status === 200) {
            // Send the file buffer
            res.setHeader('Content-Type', 'application/pdf'); // Adjust content type as needed
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.send(downloadResponse.data); // Send the PDF buffer directly
        } else {
            throw new Error('Failed to download file');
        }
    } catch (error) {
        console.error('Error downloading eBook:', error.message);
        res.status(500).json({
            message: 'Error downloading the file',
            error: error.message,
        });
    }
}


// Delete an ebook by ID
async function deleteEbook(req, res) {
    const { id } = req.params;

    try {
        // Find the ebook by ID and remove it from the database
        const deletedEbook = await Ebook.findByIdAndDelete(id);

        if (!deletedEbook) {
            return res.status(404).json({ message: 'Ebook not found.' });
        }

        return res.status(200).json({ message: 'Ebook deleted successfully.' });
    } catch (error) {
        console.error('Error deleting ebook:', error);
        return res.status(500).json({ message: 'Error deleting the ebook', error });
    }
}

module.exports = {
    createEbook,
    getAllEbooks,
    downloadEbook,
    deleteEbook, // Export the deleteEbook function
};

