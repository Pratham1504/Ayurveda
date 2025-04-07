require('dotenv').config();
const B2 = require('backblaze-b2');

const b2 = new B2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID, // Your Backblaze B2 Account ID
    applicationKey: process.env.B2_APPLICATION_KEY, // Your Backblaze B2 Application Key
});

module.exports = b2;
