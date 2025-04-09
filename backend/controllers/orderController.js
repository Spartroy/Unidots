const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Client
const createOrder = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    orderType,
    specifications,
    deadline,
    priority,
  } = req.body;

  // Validation
  if (!title || !orderType || !specifications || !deadline) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create order
  const order = await Order.create({
    title,
    description,
    orderType,
    specifications,
    deadline,
    priority: priority || 'Medium',
    client: req.user.id,
    history: [
      {
        action: 'Order Created',
        user: req.user.id,
        details: 'Order submitted by client',
      },
    ],
  });

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(400);
    throw new Error('Invalid order data');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  let query = {};

  // Filter orders based on user role
  if (req.user.role === 'client') {
    // Clients can only see their own orders
    query.client = req.user.id;
  } else if (req.user.role === 'employee') {
    // Employees can see orders assigned to them
    query = {
      $or: [
        { 'stages.review.assignedTo': req.user.id },
        { 'stages.prepress.assignedTo': req.user.id },
        { 'stages.production.assignedTo': req.user.id },
        { 'stages.delivery.assignedTo': req.user.id },
      ],
    };
  }
  // Managers and admins can see all orders

  // Apply filters if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.query.orderType) {
    query.orderType = req.query.orderType;
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  // Search by order number or title
  if (req.query.search) {
    query.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { title: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const orders = await Order.find(query)
    .populate('client', 'name email company')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count for pagination
  const total = await Order.countDocuments(query);

  res.json({
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'name email company')
    .populate('stages.review.assignedTo', 'name email')
    .populate('stages.prepress.assignedTo', 'name email')
    .populate('stages.production.assignedTo', 'name email')
    .populate('stages.delivery.assignedTo', 'name email')
    .populate('files');

  if (order) {
    // Check if user has permission to view this order
    if (
      req.user.role === 'client' &&
      order.client._id.toString() !== req.user.id
    ) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check permissions
  if (
    req.user.role === 'client' &&
    order.client.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  // Clients can only update certain fields and only if order is in certain statuses
  if (
    req.user.role === 'client' &&
    !['Submitted', 'In Review'].includes(order.status)
  ) {
    res.status(400);
    throw new Error('Order cannot be modified at this stage');
  }

  // Update fields based on request body
  const updatedFields = {};
  
  // Fields that can be updated by clients
  if (req.user.role === 'client') {
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.specifications) updatedFields.specifications = req.body.specifications;
  } 
  // Fields that can be updated by employees and managers
  else {
    // Allow updating any field provided in the request
    Object.keys(req.body).forEach(key => {
      // Don't allow changing client or orderNumber
      if (key !== 'client' && key !== 'orderNumber') {
        updatedFields[key] = req.body[key];
      }
    });
  }

  // Add history entry
  const historyEntry = {
    action: 'Order Updated',
    user: req.user.id,
    details: `Order updated by ${req.user.role}`,
  };

  // Update the order
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      ...updatedFields,
      $push: { history: historyEntry } 
    },
    { new: true, runValidators: true }
  );

  res.json(updatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Employee/Manager
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only employees and managers can update status
  if (req.user.role === 'client') {
    res.status(403);
    throw new Error('Not authorized to update order status');
  }

  // Update status
  order.status = status;
  
  // Add history entry
  order.history.push({
    action: 'Status Updated',
    user: req.user.id,
    details: `Status changed to ${status}${notes ? ': ' + notes : ''}`,
  });

  // Update stage status based on order status
  if (status === 'In Review') {
    order.stages.review.status = 'In Progress';
    if (!order.stages.review.startDate) {
      order.stages.review.startDate = Date.now();
    }
  } else if (status === 'Approved') {
    order.stages.review.status = 'Completed';
    order.stages.review.completionDate = Date.now();
    order.stages.prepress.status = 'Pending';
  } else if (status === 'In Prepress') {
    order.stages.prepress.status = 'In Progress';
    if (!order.stages.prepress.startDate) {
      order.stages.prepress.startDate = Date.now();
    }
  } else if (status === 'Ready for Production') {
    order.stages.prepress.status = 'Completed';
    order.stages.prepress.completionDate = Date.now();
    order.stages.production.status = 'Pending';
  } else if (status === 'In Production') {
    order.stages.production.status = 'In Progress';
    if (!order.stages.production.startDate) {
      order.stages.production.startDate = Date.now();
    }
  } else if (status === 'Completed') {
    order.stages.production.status = 'Completed';
    order.stages.production.completionDate = Date.now();
    order.stages.delivery.status = 'Pending';
  } else if (status === 'Delivered') {
    order.stages.delivery.status = 'Completed';
    order.stages.delivery.completionDate = Date.now();
  }

  await order.save();

  res.json(order);
});

// @desc    Assign order stage to employee
// @route   PUT /api/orders/:id/assign
// @access  Private/Manager
const assignOrderStage = asyncHandler(async (req, res) => {
  const { stage, employeeId, notes } = req.body;
  
  if (!stage || !employeeId) {
    res.status(400);
    throw new Error('Please provide stage and employee ID');
  }

  // Verify employee exists and is an employee
  const employee = await User.findById(employeeId);
  if (!employee || employee.role !== 'employee') {
    res.status(400);
    throw new Error('Invalid employee ID');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only managers can assign tasks
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to assign tasks');
  }

  // Update the assigned employee for the specified stage
  if (!['review', 'prepress', 'production', 'delivery'].includes(stage)) {
    res.status(400);
    throw new Error('Invalid stage');
  }

  order.stages[stage].assignedTo = employeeId;
  
  // Add history entry
  order.history.push({
    action: 'Assignment Updated',
    user: req.user.id,
    details: `${stage} stage assigned to ${employee.name}${notes ? ': ' + notes : ''}`,
  });

  await order.save();

  res.json(order);
});

// @desc    Calculate order cost
// @route   POST /api/orders/calculate-cost
// @access  Private
const calculateOrderCost = asyncHandler(async (req, res) => {
  const { material, dimensions, quantity, colors, finishType, orderType } = req.body;

  if (!material || !dimensions || !quantity || !colors) {
    res.status(400);
    throw new Error('Please provide all required specifications');
  }

  // Base cost calculation (this would be replaced with actual business logic)
  let baseCost = 0;
  
  // Material cost factors (example values)
  const materialCosts = {
    'Paper': 0.05,
    'Vinyl': 0.15,
    'PVC': 0.20,
    'Polyester': 0.25,
    'Other': 0.10
  };
  
  // Calculate area in square cm
  const width = dimensions.width;
  const height = dimensions.height;
  let area = width * height;
  
  // Convert to square cm if needed
  if (dimensions.unit === 'mm') {
    area = area / 100; // mm² to cm²
  } else if (dimensions.unit === 'inch') {
    area = area * 6.4516; // inch² to cm²
  }
  
  // Calculate material cost
  const materialCostFactor = materialCosts[material] || materialCosts['Other'];
  const materialCost = area * materialCostFactor;
  
  // Color cost (more colors = more expensive)
  const colorCost = colors * 10; // $10 per color
  
  // Finish cost
  let finishCost = 0;
  if (finishType === 'Glossy') {
    finishCost = area * 0.02;
  } else if (finishType === 'Matte') {
    finishCost = area * 0.015;
  } else if (finishType === 'Semi-Glossy') {
    finishCost = area * 0.018;
  }
  
  // Order type multiplier
  let orderTypeMultiplier = 1;
  if (orderType === 'Rush') {
    orderTypeMultiplier = 1.5;
  } else if (orderType === 'Standard') {
    orderTypeMultiplier = 1;
  } else if (orderType === 'Economy') {
    orderTypeMultiplier = 0.8;
  }
  
  // Quantity discount
  let quantityDiscount = 1;
  if (quantity >= 1000) {
    quantityDiscount = 0.7; // 30% discount for 1000+ units
  } else if (quantity >= 500) {
    quantityDiscount = 0.8; // 20% discount for 500+ units
  } else if (quantity >= 100) {
    quantityDiscount = 0.9; // 10% discount for 100+ units
  }
  
  // Calculate total cost per unit
  const costPerUnit = (materialCost + colorCost + finishCost) * orderTypeMultiplier;
  
  // Calculate total cost with quantity discount
  const totalCost = costPerUnit * quantity * quantityDiscount;
  
  // Round to 2 decimal places
  const finalCost = Math.round(totalCost * 100) / 100;
  
  res.json({
    estimatedCost: finalCost,
    currency: 'USD',
    breakdown: {
      materialCost: materialCost * quantity,
      colorCost: colorCost * quantity,
      finishCost: finishCost * quantity,
      orderTypeMultiplier,
      quantityDiscount,
      costPerUnit,
    },
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  assignOrderStage,
  calculateOrderCost,
};