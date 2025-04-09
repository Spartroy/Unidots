const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize, manager } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);

// Client registration is public, but employee/manager registration requires authorization
router.post('/', registerUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin/Manager routes
router.route('/')
  .get(protect, manager, getUsers);

router.route('/:id')
  .get(protect, manager, getUserById)
  .put(protect, manager, updateUser)
  .delete(protect, manager, deleteUser);

module.exports = router;