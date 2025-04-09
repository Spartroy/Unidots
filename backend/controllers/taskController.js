const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Manager
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    assignedTo,
    relatedOrder,
    dueDate,
    priority,
    taskType,
  } = req.body;

  // Validation
  if (!title || !description || !assignedTo) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if assigned user exists and is an employee
  const assignedUser = await User.findById(assignedTo);
  if (!assignedUser || assignedUser.role !== 'employee') {
    res.status(400);
    throw new Error('Invalid employee assignment');
  }

  // Create task
  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: req.user.id,
    relatedOrder: relatedOrder || null,
    dueDate: dueDate || null,
    priority: priority || 'Medium',
    taskType: taskType || 'General',
  });

  if (task) {
    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let query = {};

  // Filter tasks based on user role
  if (req.user.role === 'employee') {
    // Employees can only see tasks assigned to them
    query.assignedTo = req.user.id;
  } else if (req.user.role === 'manager') {
    // Managers can filter by employee if provided
    if (req.query.employee) {
      query.assignedTo = req.query.employee;
    }
  }

  // Apply filters if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.query.taskType) {
    query.taskType = req.query.taskType;
  }

  if (req.query.relatedOrder) {
    query.relatedOrder = req.query.relatedOrder;
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  // Search by title
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: 'i' };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('relatedOrder', 'orderNumber title')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count for pagination
  const total = await Task.countDocuments(query);

  res.json({
    tasks,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('relatedOrder', 'orderNumber title status');

  if (task) {
    // Check if user has permission to view this task
    if (
      req.user.role === 'employee' &&
      task.assignedTo._id.toString() !== req.user.id
    ) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check permissions
  if (
    req.user.role === 'employee' &&
    task.assignedTo.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Update fields based on request body
  const updatedFields = {};
  
  // Fields that can be updated by employees
  if (req.user.role === 'employee') {
    if (req.body.notes) updatedFields.notes = req.body.notes;
    if (req.body.progress) updatedFields.progress = req.body.progress;
  } 
  // Fields that can be updated by managers
  else if (req.user.role === 'manager' || req.user.role === 'admin') {
    // Allow updating any field provided in the request
    Object.keys(req.body).forEach(key => {
      updatedFields[key] = req.body[key];
    });
  }

  // Update the task
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Manager
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.remove();

  res.json({ message: 'Task removed' });
});

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
// @access  Private/Employee
const completeTask = asyncHandler(async (req, res) => {
  const { completionNotes } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user is assigned to this task
  if (task.assignedTo.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to complete this task');
  }

  // Update task status
  task.status = 'Completed';
  task.completedAt = Date.now();
  task.completionNotes = completionNotes || '';

  await task.save();

  res.json(task);
});

// @desc    Assign task to employee
// @route   PUT /api/tasks/:id/assign
// @access  Private/Manager
const assignTask = asyncHandler(async (req, res) => {
  const { employeeId, notes } = req.body;
  
  if (!employeeId) {
    res.status(400);
    throw new Error('Please provide employee ID');
  }

  // Check if employee exists and is an employee
  const employee = await User.findById(employeeId);
  if (!employee || employee.role !== 'employee') {
    res.status(400);
    throw new Error('Invalid employee assignment');
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Update the assigned employee
  task.assignedTo = employeeId;
  if (notes) task.notes = notes;

  await task.save();

  res.json(task);
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  assignTask,
};