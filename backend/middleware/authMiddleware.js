const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from the header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader ||!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // The token is the part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // We will move this secret later

    // Add user from payload to the request object
    req.user = decoded.user;
    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;