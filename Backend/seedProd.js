require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios'); // Import axios
const app = express();

const PORT = process.env.PORT || 3000; // Specify the port

// Function to get B2 authorization token
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

// Middleware for authorization
const authorizeB2 = async (req, res, next) => {
  try {
    const authData = await getB2AuthToken();
    req.b2AuthToken = authData; // Store the token in request for later use
    next(); // Call next middleware or route handler
  } catch (error) {
    res.status(500).json({
      message: 'Authorization failed',
      error: error.message,
    });
  }
};

// Download route
app.get('/download/:fileName', authorizeB2, async (req, res) => {
  const { fileName } = req.params;
  const bucketName = process.env.BACKBLAZE_BUCKET_NAME;

  try {
    console.log(`Attempting to download file: ${fileName} from bucket: ${bucketName}`);

    // Fetch the file as an array buffer
    const downloadResponse = await axios({
      method: 'get',
      url: `${req.b2AuthToken.downloadUrl}/file/${bucketName}/${fileName}`,
      responseType: 'arraybuffer', // Important: Set the response type
      headers: {
        Authorization: req.b2AuthToken.authorizationToken, // Use the generated token
      },
    });

    console.log('Download response status:', downloadResponse.status);
    console.log('Download response headers:', downloadResponse.headers);

    // Send the file buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(downloadResponse.data); // Send the PDF buffer directly
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).json({
      message: 'Error downloading the file',
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
