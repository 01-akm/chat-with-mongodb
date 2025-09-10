const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  console.log('--- STARTING REGISTRATION PROCESS ---');
  try {
    const { username, email, password } = req.body;
    console.log(' Received data:', { username, email, password: '***' }); // Don't log the actual password

    if (!username ||!email ||!password) {
      console.log(' Missing fields. Registration aborted.');
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    console.log(' Checking if user exists...');
    let user = await User.findOne({ username: username.trim() });
    if (user) {
      console.log(` User "${username}" already exists. Aborting.`);
      return res.status(400).json({ msg: 'User already exists' });
    }
    console.log(' User does not exist. Proceeding...');

    user = new User({
      username: username.trim(),
      email: email.trim(),
      passwordHash: password.trim(),
    });

    console.log(' Hashing password...');
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password.trim(), salt);
    console.log(' Password hashed successfully.');

    console.log(' Attempting to save user to database...');
    const savedUser = await user.save();
    console.log(' User saved to database:', savedUser);

    const payload = {
      user: {
        id: user.id,
      },
    };

    console.log(' Creating JWT token...');
    console.log(' Using JWT_SECRET:', process.env.JWT_SECRET? 'Secret is SET' : 'Secret is NOT SET or UNDEFINED');
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    console.log(' Token created successfully:', token);
    console.log('--- REGISTRATION PROCESS COMPLETE ---');
    res.json({ token });

  } catch (err) {
    console.error(' An error occurred in the registerUser function:', err);
    res.status(500).send('Server error');
  }
};

// The loginUser function remains the same for now
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password.trim(), user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
};