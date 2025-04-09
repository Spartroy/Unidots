const asyncHandler = require('express-async-handler');
const Claim = require('../models/claimModel');
const Order = require('../models/orderModel');

// @desc    Create new claim
// @route   POST /api/claims
// @access  Private/Client
const createClaim = asyncHandler(async (req, res) => {
  const {
    order,
    title,
    description,
    claimType,
    severity,
  } = req.body;

  // Validation
  if (!order || !title || !description || !claimType) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if order exists
  const orderExists = await Order.findById(order);
  if (!orderExists) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if client owns the order
  if (orderExists.client.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to create claim for this order');
  }

  // Create claim
  const claim = await Claim.create({
    order,
    client: req.user.id,
    title,
    description,
    claimType,
    severity: severity || 'Medium',
    history: [
      {
        action: 'Claim Created',
        user: req.user.id,
        details: 'Claim submitted by client',
      },
    ],
  });

  if (claim) {
    res.status(201).json(claim);
  } else {
    res.status(400);
    throw new Error('Invalid claim data');
  }
});

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private
const getClaims = asyncHandler(async (req, res) => {
  let query = {};

  // Filter claims based on user role
  if (req.user.role === 'client') {
    // Clients can only see their own claims
    query.client = req.user.id;
  } else if (req.user.role === 'employee') {
    // Employees can see claims assigned to them
    query.assignedTo = req.user.id;
  }
  // Managers and admins can see all claims

  // Apply filters if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.severity) {
    query.severity = req.query.severity;
  }

  if (req.query.claimType) {
    query.claimType = req.query.claimType;
  }

  if (req.query.order) {
    query.order = req.query.order;
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  // Search by claim number or title
  if (req.query.search) {
    query.$or = [
      { claimNumber: { $regex: req.query.search, $options: 'i' } },
      { title: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const claims = await Claim.find(query)
    .populate('client', 'name email company')
    .populate('order', 'orderNumber title')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count for pagination
  const total = await Claim.countDocuments(query);

  res.json({
    claims,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get claim by ID
// @route   GET /api/claims/:id
// @access  Private
const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('client', 'name email company')
    .populate('order', 'orderNumber title status')
    .populate('assignedTo', 'name email')
    .populate('resolution.resolvedBy', 'name email')
    .populate('files');

  if (claim) {
    // Check if user has permission to view this claim
    if (
      req.user.role === 'client' &&
      claim.client._id.toString() !== req.user.id
    ) {
      res.status(403);
      throw new Error('Not authorized to view this claim');
    }

    if (
      req.user.role === 'employee' &&
      claim.assignedTo &&
      claim.assignedTo._id.toString() !== req.user.id
    ) {
      res.status(403);
      throw new Error('Not authorized to view this claim');
    }

    res.json(claim);
  } else {
    res.status(404);
    throw new Error('Claim not found');
  }
});

// @desc    Update claim
// @route   PUT /api/claims/:id
// @access  Private
const updateClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    res.status(404);
    throw new Error('Claim not found');
  }

  // Check permissions
  if (
    req.user.role === 'client' &&
    claim.client.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized to update this claim');
  }

  // Clients can only update certain fields and only if claim is in certain statuses
  if (
    req.user.role === 'client' &&
    !['Submitted', 'Under Review'].includes(claim.status)
  ) {
    res.status(400);
    throw new Error('Claim cannot be modified at this stage');
  }

  // Update fields based on request body
  const updatedFields = {};
  
  // Fields that can be updated by clients
  if (req.user.role === 'client') {
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.severity) updatedFields.severity = req.body.severity;
  } 
  // Fields that can be updated by employees and managers
  else {
    // Allow updating any field provided in the request
    Object.keys(req.body).forEach(key => {
      // Don't allow changing client or claimNumber
      if (key !== 'client' && key !== 'claimNumber' && key !== 'order') {
        updatedFields[key] = req.body[key];
      }
    });
  }

  // Add history entry
  const historyEntry = {
    action: 'Claim Updated',
    user: req.user.id,
    details: `Claim updated by ${req.user.role}`,
  };

  // Update the claim
  const updatedClaim = await Claim.findByIdAndUpdate(
    req.params.id,
    { 
      ...updatedFields,
      $push: { history: historyEntry } 
    },
    { new: true, runValidators: true }
  );

  res.json(updatedClaim);
});

// @desc    Update claim status
// @route   PUT /api/claims/:id/status
// @access  Private/Employee/Manager
const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    res.status(404);
    throw new Error('Claim not found');
  }

  // Only employees and managers can update status
  if (req.user.role === 'client') {
    res.status(403);
    throw new Error('Not authorized to update claim status');
  }

  // Update status
  claim.status = status;
  
  // Add history entry
  claim.history.push({
    action: 'Status Updated',
    user: req.user.id,
    details: `Status changed to ${status}${notes ? ': ' + notes : ''}`,
  });

  // If status is resolved or rejected, add resolution details
  if (status === 'Resolved' || status === 'Rejected') {
    const { action, details } = req.body;
    
    if (!action) {
      res.status(400);
      throw new Error('Please provide resolution action');
    }
    
    claim.resolution = {
      action,
      details: details || '',
      date: Date.now(),
      resolvedBy: req.user.id,
    };
  }

  await claim.save();

  res.json(claim);
});

// @desc    Assign claim to employee
// @route   PUT /api/claims/:id/assign
// @access  Private/Manager
const assignClaim = asyncHandler(async (req, res) => {
  const { employeeId, notes } = req.body;
  
  if (!employeeId) {
    res.status(400);
    throw new Error('Please provide employee ID');
  }

  const claim = await Claim.findById(req.params.id);
  if (!claim) {
    res.status(404);
    throw new Error('Claim not found');
  }

  // Only managers can assign claims
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to assign claims');
  }

  // Update the assigned employee
  claim.assignedTo = employeeId;
  
  // Update status to Under Review if it's still in Submitted status
  if (claim.status === 'Submitted') {
    claim.status = 'Under Review';
  }
  
  // Add history entry
  claim.history.push({
    action: 'Assignment Updated',
    user: req.user.id,
    details: `Claim assigned to employee${notes ? ': ' + notes : ''}`,
  });

  await claim.save();

  res.json(claim);
});

module.exports = {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  updateClaimStatus,
  assignClaim,
};