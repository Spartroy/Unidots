const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  assignTask,
} = require('../controllers/taskController');
const { protect, staff, manager } = require('../middleware/authMiddleware');

// Staff routes
router.route('/')
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask);

router.route('/:id/complete')
  .put(protect, staff, completeTask);

// Manager routes
router.route('/')
  .post(protect, manager, createTask);

router.route('/:id')
  .delete(protect, manager, deleteTask);

router.route('/:id/assign')
  .put(protect, manager, assignTask);

module.exports = router;