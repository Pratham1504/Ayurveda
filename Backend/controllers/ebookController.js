const Ebook = require('../models/ebookModel');
require('dotenv').config();

// Create ebook function
const createEbook = async (req, res) => {
    try {
        const { title, author, description, fileUrl } = req.body;
        // const file = req.file;

        // Validate input
        if (!fileUrl) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Upload to Backblaze B2
        const ebook = new Ebook({
            title,
            author,
            description,
            fileUrl, // Use the URL directly from the request body
            dateUploaded: new Date(),
        });
        await ebook.save();

        return res.status(201).json(ebook);
    } catch (error) {
        console.error("Error creating ebook:", error);
        return res.status(500).json({ message: 'Failed to create ebook.' });
    }
};


// Get all eBooks
async function getAllEbooks(_, res) {
    try {
        const ebooks = await Ebook.find();
        res.status(200).json(ebooks);
    } catch (error) {
        console.error('Error fetching eBooks:', error);
        res.status(500).json({ message: 'Error fetching eBooks', error });
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
    deleteEbook, // Export the deleteEbook function
};

