const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  assignOrderStage,
  calculateOrderCost,
} = require('../controllers/orderController');
const { protect, client, staff, manager } = require('../middleware/authMiddleware');

// Client routes
router.route('/')
  .post(protect, client, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrder);

// Staff routes
router.route('/:id/status')
  .put(protect, staff, updateOrderStatus);

// Manager routes
router.route('/:id/assign')
  .put(protect, manager, assignOrderStage);

// Cost calculation route
router.route('/:id/cost')
  .post(protect, calculateOrderCost);

module.exports = router;