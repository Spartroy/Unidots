const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Claim = require('../models/claimModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

// @desc    Generate order report
// @route   POST /api/reports/orders
// @access  Private/Manager
const generateOrderReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, orderType } = req.body;

  // Build query
  let query = {};

  // Date range
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Order type filter
  if (orderType) {
    query.orderType = orderType;
  }

  // Get orders
  const orders = await Order.find(query)
    .populate('client', 'name email company')
    .sort({ createdAt: -1 });

  // Calculate statistics
  const totalOrders = orders.length;
  const ordersByStatus = {};
  const ordersByType = {};
  let totalRevenue = 0;

  orders.forEach(order => {
    // Count by status
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    
    // Count by type
    ordersByType[order.orderType] = (ordersByType[order.orderType] || 0) + 1;
    
    // Sum revenue
    if (order.cost && order.cost.finalCost) {
      totalRevenue += order.cost.finalCost;
    }
  });

  // Calculate average processing time
  const completedOrders = orders.filter(order => order.status === 'Completed' || order.status === 'Delivered');
  let avgProcessingTime = 0;
  
  if (completedOrders.length > 0) {
    const totalProcessingTime = completedOrders.reduce((sum, order) => {
      const completionDate = order.stages.production.completionDate || order.updatedAt;
      const submissionDate = order.createdAt;
      return sum + (completionDate - submissionDate);
    }, 0);
    
    avgProcessingTime = totalProcessingTime / completedOrders.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  res.json({
    reportType: 'Order Report',
    dateRange: { startDate, endDate },
    generatedAt: new Date(),
    totalOrders,
    ordersByStatus,
    ordersByType,
    totalRevenue,
    avgProcessingTime,
    currency: orders[0]?.cost?.currency || 'USD',
    orders: orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      title: order.title,
      client: order.client.name,
      company: order.client.company,
      status: order.status,
      orderType: order.orderType,
      createdAt: order.createdAt,
      deadline: order.deadline,
      revenue: order.cost?.finalCost || 0,
    })),
  });
});

// @desc    Generate claim report
// @route   POST /api/reports/claims
// @access  Private/Manager
const generateClaimReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, claimType, severity } = req.body;

  // Build query
  let query = {};

  // Date range
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Claim type filter
  if (claimType) {
    query.claimType = claimType;
  }

  // Severity filter
  if (severity) {
    query.severity = severity;
  }

  // Get claims
  const claims = await Claim.find(query)
    .populate('client', 'name email company')
    .populate('order', 'orderNumber title')
    .sort({ createdAt: -1 });

  // Calculate statistics
  const totalClaims = claims.length;
  const claimsByStatus = {};
  const claimsByType = {};
  const claimsBySeverity = {};

  claims.forEach(claim => {
    // Count by status
    claimsByStatus[claim.status] = (claimsByStatus[claim.status] || 0) + 1;
    
    // Count by type
    claimsByType[claim.claimType] = (claimsByType[claim.claimType] || 0) + 1;
    
    // Count by severity
    claimsBySeverity[claim.severity] = (claimsBySeverity[claim.severity] || 0) + 1;
  });

  // Calculate average resolution time
  const resolvedClaims = claims.filter(claim => claim.status === 'Resolved' || claim.status === 'Closed');
  let avgResolutionTime = 0;
  
  if (resolvedClaims.length > 0) {
    const totalResolutionTime = resolvedClaims.reduce((sum, claim) => {
      const resolutionDate = claim.resolution?.date || claim.updatedAt;
      const submissionDate = claim.createdAt;
      return sum + (resolutionDate - submissionDate);
    }, 0);
    
    avgResolutionTime = totalResolutionTime / resolvedClaims.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  res.json({
    reportType: 'Claim Report',
    dateRange: { startDate, endDate },
    generatedAt: new Date(),
    totalClaims,
    claimsByStatus,
    claimsByType,
    claimsBySeverity,
    avgResolutionTime,
    claims: claims.map(claim => ({
      id: claim._id,
      claimNumber: claim.claimNumber,
      title: claim.title,
      client: claim.client.name,
      company: claim.client.company,
      order: claim.order.orderNumber,
      status: claim.status,
      claimType: claim.claimType,
      severity: claim.severity,
      createdAt: claim.createdAt,
      resolvedAt: claim.resolution?.date,
    })),
  });
});

// @desc    Generate employee performance report
// @route   POST /api/reports/employees
// @access  Private/Manager
const generateEmployeePerformanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, department, employeeId } = req.body;

  // Build query for employees
  let userQuery = { role: 'employee' };
  
  if (department) {
    userQuery.department = department;
  }
  
  if (employeeId) {
    userQuery._id = employeeId;
  }

  // Get employees
  const employees = await User.find(userQuery).select('-password');

  // Build date range query for tasks
  let dateQuery = {};
  if (startDate && endDate) {
    dateQuery = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  }

  // Prepare employee performance data
  const employeePerformance = [];

  // For each employee, get their tasks and calculate metrics
  for (const employee of employees) {
    // Get tasks assigned to this employee
    const tasks = await Task.find({
      assignedTo: employee._id,
      ...dateQuery,
    });

    // Get orders where this employee was involved
    const orders = await Order.find({
      $or: [
        { 'stages.review.assignedTo': employee._id },
        { 'stages.prepress.assignedTo': employee._id },
        { 'stages.production.assignedTo': employee._id },
        { 'stages.delivery.assignedTo': employee._id },
      ],
      ...dateQuery,
    });

    // Calculate metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate average task completion time
    let avgCompletionTime = 0;
    const completedTasksList = tasks.filter(task => task.status === 'Completed' && task.completedAt);
    
    if (completedTasksList.length > 0) {
      const totalCompletionTime = completedTasksList.reduce((sum, task) => {
        return sum + (task.completedAt - task.createdAt);
      }, 0);
      
      avgCompletionTime = totalCompletionTime / completedTasksList.length / (1000 * 60 * 60); // Convert to hours
    }

    // Add employee performance data
    employeePerformance.push({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        specialization: employee.specialization,
      },
      metrics: {
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        completionRate: completionRate.toFixed(2) + '%',
        avgCompletionTime: avgCompletionTime.toFixed(2) + ' hours',
        ordersProcessed: orders.length,
      },
      tasksByStatus: {
        pending: tasks.filter(task => task.status === 'Pending').length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length,
        completed: completedTasks,
        onHold: tasks.filter(task => task.status === 'On Hold').length,
        cancelled: tasks.filter(task => task.status === 'Cancelled').length,
      },
      tasksByPriority: {
        low: tasks.filter(task => task.priority === 'Low').length,
        medium: tasks.filter(task => task.priority === 'Medium').length,
        high: tasks.filter(task => task.priority === 'High').length,
        urgent: tasks.filter(task => task.priority === 'Urgent').length,
      },
    });
  }

  res.json({
    reportType: 'Employee Performance Report',
    dateRange: { startDate, endDate },
    generatedAt: new Date(),
    department: department || 'All',
    totalEmployees: employees.length,
    employeePerformance,
  });
});

// @desc    Generate client report
// @route   POST /api/reports/clients
// @access  Private/Manager
const generateClientReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, clientId } = req.body;

  // Build query for clients
  let userQuery = { role: 'client' };
  
  if (clientId) {
    userQuery._id = clientId;
  }

  // Get clients
  const clients = await User.find(userQuery).select('-password');

  // Build date range query
  let dateQuery = {};
  if (startDate && endDate) {
    dateQuery = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  }

  // Prepare client data
  const clientData = [];

  // For each client, get their orders and claims and calculate metrics
  for (const client of clients) {
    // Get orders for this client
    const orders = await Order.find({
      client: client._id,
      ...dateQuery,
    });

    // Get claims for this client
    const claims = await Claim.find({
      client: client._id,
      ...dateQuery,
    });

    // Calculate revenue
    let totalRevenue = 0;
    orders.forEach(order => {
      if (order.cost && order.cost.finalCost) {
        totalRevenue += order.cost.finalCost;
      }
    });

    // Add client data
    clientData.push({
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        company: client.company,
      },
      metrics: {
        totalOrders: orders.length,
        totalClaims: claims.length,
        claimRate: orders.length > 0 ? (claims.length / orders.length) * 100 : 0,
        totalRevenue,
        currency: orders[0]?.cost?.currency || 'USD',
      },
      ordersByStatus: {
        submitted: orders.filter(order => order.status === 'Submitted').length,
        inReview: orders.filter(order => order.status === 'In Review').length,
        approved: orders.filter(order => order.status === 'Approved').length,
        inPrepress: orders.filter(order => order.status === 'In Prepress').length,
        readyForProduction: orders.filter(order => order.status === 'Ready for Production').length,
        inProduction: orders.filter(order => order.status === 'In Production').length,
        completed: orders.filter(order => order.status === 'Completed').length,
        delivered: orders.filter(order => order.status === 'Delivered').length,
        cancelled: orders.filter(order => order.status === 'Cancelled').length,
        onHold: orders.filter(order => order.status === 'On Hold').length,
      },
      claimsByStatus: {
        submitted: claims.filter(claim => claim.status === 'Submitted').length,
        underReview: claims.filter(claim => claim.status === 'Under Review').length,
        inProgress: claims.filter(claim => claim.status === 'In Progress').length,
        resolved: claims.filter(claim => claim.status === 'Resolved').length,
        rejected: claims.filter(claim => claim.status === 'Rejected').length,
        closed: claims.filter(claim => claim.status === 'Closed').length,
      },
    });
  }

  res.json({
    reportType: 'Client Report',
    dateRange: { startDate, endDate },
    generatedAt: new Date(),
    totalClients: clients.length,
    clientData,
  });
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Manager
const getReports = asyncHandler(async (req, res) => {
  // This would typically fetch from a reports collection
  // For now, we'll return a message since reports are generated on-demand
  res.json({
    message: 'Reports are generated on-demand. Please use the specific report endpoints.',
    availableReports: [
      { type: 'Order Report', endpoint: '/api/reports/orders' },
      { type: 'Claim Report', endpoint: '/api/reports/claims' },
      { type: 'Employee Performance Report', endpoint: '/api/reports/employees' },
      { type: 'Client Report', endpoint: '/api/reports/clients' },
    ],
  });
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private/Manager
const getReportById = asyncHandler(async (req, res) => {
  // This would typically fetch a specific report from a reports collection
  // For now, we'll return a message since reports are generated on-demand
  res.status(404);
  throw new Error('Report not found. Reports are generated on-demand and not stored.');
});

module.exports = {
  generateOrderReport,
  generateClaimReport,
  generateEmployeePerformanceReport,
  generateClientReport,
  getReports,
  getReportById,
};