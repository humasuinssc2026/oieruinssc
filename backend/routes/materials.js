const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const materialsController = require('../controllers/materialsController');
const { verifyToken } = require('../controllers/authController');

// Pastikan folder untuk upload dokumen ada
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer untuk penyimpanan file lokal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'document-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'document_file' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Hanya file PDF yang diizinkan untuk dokumen/modul.'), false);
  }
  if (file.fieldname === 'thumbnail_file' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Hanya file gambar yang diizinkan untuk thumbnail.'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const uploadAny = upload.any();

const uploadMiddleware = (req, res, next) => {
  uploadAny(req, res, function (err) {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// API Routes
router.post('/upload', uploadMiddleware, materialsController.uploadMaterial);
router.get('/', materialsController.getMaterials);
router.get('/stream/:filename', materialsController.streamVideo);
router.put('/:id', uploadMiddleware, materialsController.updateMaterial);
router.delete('/:id', materialsController.deleteMaterial);
router.post('/:id/view', materialsController.incrementMaterialView);

// Parts Routes
router.post('/:id/parts', upload.single('document_file'), materialsController.addMaterialPart);
router.delete('/parts/:part_id', materialsController.deleteMaterialPart);

// Reviews Routes
router.get('/:id/reviews', materialsController.getReviews);
router.post('/:id/reviews', materialsController.addReview);

// Discussions Routes
router.get('/:id/discussions', materialsController.getDiscussions);
router.post('/:id/discussions', materialsController.addDiscussion);

// Ratings Routes
router.get('/:id/ratings', materialsController.getRatings);
router.post('/:id/rate', verifyToken, materialsController.rateMaterial);

// Rute Komentar
router.get('/:id/comments', materialsController.getComments);
router.post('/:id/comments', verifyToken, materialsController.addComment);

module.exports = router;
