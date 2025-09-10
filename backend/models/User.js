const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // We store the filename here
    default: '',  // Optional: start empty
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
