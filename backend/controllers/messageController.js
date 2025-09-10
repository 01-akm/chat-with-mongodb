const Message = require('../models/Message');

const getChatHistory = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const recipientId = req.params.recipientId;

    // Find all messages where the sender/recipient pair matches in either direction
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, recipientId: recipientId },
        { senderId: recipientId, recipientId: loggedInUserId },
      ],
    }).sort({ timestamp: 'asc' }); // Sort by timestamp ascending (oldest first)

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getChatHistory,
};