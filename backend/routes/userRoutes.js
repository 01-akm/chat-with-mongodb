const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  updateUserProfile,
  getUserProfile,
} = require('../controllers/userController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to /uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Routes
router.get('/', authMiddleware, getAllUsers);
router.get('/profile', authMiddleware, getUserProfile);

router.put(
  '/profile',
  authMiddleware,
  upload.single('profilePicture'),
  updateUserProfile
);

module.exports = router;
