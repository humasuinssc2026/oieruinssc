const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const profileUploadPath = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(profileUploadPath)) {
  fs.mkdirSync(profileUploadPath, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya diperbolehkan format gambar (JPEG, JPG, PNG, WEBP)'));
    }
  }
});

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.get('/history', userController.getHistory);
router.post('/history', userController.recordHistory);
router.post('/profile-pic', (req, res, next) => {
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'Upload error: ' + err.message });
    }
    next();
  });
}, userController.uploadProfilePic);

module.exports = router;
