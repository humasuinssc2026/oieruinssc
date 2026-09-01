const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Catat kunjungan baru
router.post('/visit', statsController.recordVisit);

// Ambil statistik kunjungan
router.get('/', statsController.getStats);

// Ambil data grafik
router.get('/chart-data', statsController.getChartData);

// Ambil statistik per fakultas
router.get('/faculties', statsController.getFacultyStats);

// Ambil testimonial teratas untuk beranda
router.get('/testimonials', statsController.getTestimonials);

module.exports = router;
