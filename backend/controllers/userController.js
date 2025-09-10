const User = require('../models/User');

// Get all users except the current user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user profile, including optional profile picture upload
const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

   if (req.file) {
  console.log('Profile picture uploaded:', req.file.originalname);
  user.profilePicture = req.file.filename; // <-- SAVE IT!
}

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get current user's profile (without password)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllUsers,
  updateUserProfile,
  getUserProfile,
};
