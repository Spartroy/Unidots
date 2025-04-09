const express = require('express');
const router = express.Router();
const {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  updateClaimStatus,
  assignClaim,
} = require('../controllers/claimController');
const { protect, client, staff, manager } = require('../middleware/authMiddleware');

// Client routes
router.route('/')
  .post(protect, client, createClaim)
  .get(protect, getClaims);

router.route('/:id')
  .get(protect, getClaimById)
  .put(protect, updateClaim);

// Staff routes
router.route('/:id/status')
  .put(protect, staff, updateClaimStatus);

// Manager routes
router.route('/:id/assign')
  .put(protect, manager, assignClaim);

module.exports = router;