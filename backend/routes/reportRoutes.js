const express = require('express');
const router = express.Router();
const {
  generateOrderReport,
  generateClaimReport,
  generateEmployeePerformanceReport,
  generateClientReport,
  getReports,
  getReportById,
} = require('../controllers/reportController');
const { protect, manager } = require('../middleware/authMiddleware');

// Manager only routes
router.route('/')
  .get(protect, manager, getReports);

router.route('/:id')
  .get(protect, manager, getReportById);

router.route('/orders')
  .post(protect, manager, generateOrderReport);

router.route('/claims')
  .post(protect, manager, generateClaimReport);

router.route('/employees')
  .post(protect, manager, generateEmployeePerformanceReport);

router.route('/clients')
  .post(protect, manager, generateClientReport);

module.exports = router;