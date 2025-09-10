const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// We will create the messageController in the next step
const { getChatHistory } = require('../controllers/messageController');

// @route   GET /api/messages/history/:recipientId
// @desc    Get chat history with a specific user
// @access  Private
router.get('/history/:recipientId', authMiddleware, getChatHistory);

module.exports = router;