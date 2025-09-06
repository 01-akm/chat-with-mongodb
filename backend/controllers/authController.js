const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      passwordHash: password, // We will hash this next
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create and return a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'YOUR_JWT_SECRET', // We will move this to a.env file later
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
};