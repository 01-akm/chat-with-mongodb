const express = require('express');
const router = express.Router();

// @route   POST /register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  res.send('User registration route');
});

module.exports = router;