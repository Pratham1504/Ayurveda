require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const multer = require('multer');
const axios = require('axios'); // Import axios for B2 authorization

const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Middleware to get Backblaze B2 authorization token
const getB2AuthToken = async () => {
    try {
        const response = await axios.post('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {}, {
            auth: {
                username: process.env.B2_APPLICATION_KEY_ID,
                password: process.env.B2_APPLICATION_KEY,
            },
        });
        return response.data; // Return the authorization response
    } catch (error) {
        console.error('Error getting B2 auth token:', error.message);
        throw new Error('Failed to authorize with B2');
    }
};

// Route to create a new ebook
router.post('/', upload.single('file'), ebookController.createEbook); // Ensure that the field name matches

// Route to get all eBooks
router.get('/', ebookController.getAllEbooks);

// Route to download a specific eBook
router.get('/download/:fileName', async (req, res) => {
    const { fileName } = req.params;

    try {
        const authData = await getB2AuthToken();
        const downloadUrl = `${authData.downloadUrl}/file/${process.env.BACKBLAZE_BUCKET_NAME}/${fileName}`;

        const downloadResponse = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'arraybuffer', // Important: Set the response type
            headers: {
                Authorization: authData.authorizationToken, // Use the generated token
            },
        });

        if (downloadResponse.status === 200) {
            res.setHeader('Content-Type', 'application/pdf'); // Adjust content type as needed
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.send(downloadResponse.data); // Send the file buffer
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
});

// Route to delete an eBook by ID
router.delete('/:id', ebookController.deleteEbook);

module.exports = router;
