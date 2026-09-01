const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/recent', dashboardController.getRecentActivity);

router.get('/reviews', dashboardController.getAllReviews);
router.put('/reviews/:id/hide', dashboardController.toggleReviewVisibility);
router.delete('/reviews/:id', dashboardController.deleteReview);

router.get('/users', dashboardController.getAllUsers);
router.post('/users', dashboardController.createUser);
router.put('/users/:id', dashboardController.updateUser);
router.put('/users/:id/role', dashboardController.updateUserRole);
router.delete('/users/:id', dashboardController.deleteUser);

module.exports = router;
