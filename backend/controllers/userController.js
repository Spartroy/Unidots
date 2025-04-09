const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public/Private (depends on role)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, company, position, phone, address, department } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Role validation - only managers/admins can create employees and managers
  if ((role === 'employee' || role === 'manager') && req.user && req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to create this user type');
  }

  // Additional validation for client role
  if (role === 'client' && !company) {
    res.status(400);
    throw new Error('Company name is required for client accounts');
  }

  // Additional validation for employee/manager role
  if ((role === 'employee' || role === 'manager') && !department) {
    res.status(400);
    throw new Error('Department is required for employee and manager accounts');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'client', // Default to client if not specified
    company,
    position,
    phone,
    address,
    department: department || 'none',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      department: user.department,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is inactive. Please contact support.');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    department: user.department,
    token: generateToken(user._id),
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      position: user.position,
      phone: user.phone,
      address: user.address,
      department: user.department,
      specialization: user.specialization,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // Fields that any user can update
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.position = req.body.position || user.position;
    
    // Address update if provided
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address,
      };
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Client-specific fields
    if (user.role === 'client') {
      user.company = req.body.company || user.company;
    }

    // Employee/Manager-specific fields
    if (user.role === 'employee' || user.role === 'manager') {
      user.specialization = req.body.specialization || user.specialization;
    }

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.company,
      position: updatedUser.position,
      phone: updatedUser.phone,
      address: updatedUser.address,
      department: updatedUser.department,
      specialization: updatedUser.specialization,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin/Manager
const getUsers = asyncHandler(async (req, res) => {
  // Only managers and admins can view all users
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view all users');
  }

  let query = {};

  // Filter by role if provided
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by department if provided
  if (req.query.department) {
    query.department = req.query.department;
  }

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count for pagination
  const total = await User.countDocuments(query);

  res.json({
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
const getUserById = asyncHandler(async (req, res) => {
  // Only managers and admins can view user details
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view user details');
  }

  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
const updateUser = asyncHandler(async (req, res) => {
  // Only managers and admins can update users
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update users');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    // Role-specific fields
    if (user.role === 'client') {
      user.company = req.body.company || user.company;
    }
    
    if (user.role === 'employee' || user.role === 'manager') {
      user.department = req.body.department || user.department;
      user.specialization = req.body.specialization || user.specialization;
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Only admins can delete users
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete users');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    // Instead of deleting, set as inactive
    user.isActive = false;
    await user.save();
    
    res.json({ message: 'User deactivated' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};