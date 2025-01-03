const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); // Assumes verifyToken middleware is implemented
const WordCount = require('../models/WordCount'); // Assuming Mongoose is used for DB

// Add a word count entry
router.post('/saveEntry', authenticate, async (req, res) => {
    const { title, text } = req.body;
    const userId = req.user.id;

    if (!title || !text) {
        return res.status(400).json({ message: 'Title and text are required' });
    }

    try {
        const newEntry = new WordCount({ userId, title, text });
        await newEntry.save();
        res.status(201).json({ message: 'Entry saved successfully', entry: newEntry });
    } catch (error) {
        console.error('Error saving entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all word count entries for the logged-in user
router.get('/entries', authenticate, async (req, res) => {
    try {
        const entries = await WordCount.find({ userId: req.user.id });
        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a word count entry
router.put('/updateEntry/:id', authenticate, async (req, res) => {
    const { title, text } = req.body;

    try {
        const updatedEntry = await WordCount.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, text },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry updated successfully', entry: updatedEntry });
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a word count entry
router.delete('/deleteEntry/:id', authenticate, async (req, res) => {
    try {
        const deletedEntry = await WordCount.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
