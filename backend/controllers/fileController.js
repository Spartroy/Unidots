const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and AI files
  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'application/pdf',
    'application/postscript', // AI files
    'application/illustrator', // AI files
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload an image, PDF, or AI file.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// Middleware for handling file uploads
const uploadMiddleware = upload.single('file');

// @desc    Upload a file
// @route   POST /api/files
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  // Handle upload using multer middleware
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      res.status(400);
      throw new Error(`Upload error: ${err.message}`);
    } else if (err) {
      // An unknown error occurred
      res.status(400);
      throw new Error(`Error: ${err.message}`);
    }

    // If no file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    const { fileType, relatedOrder, relatedClaim, version, notes, tags } = req.body;

    // Create file record in database
    const file = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      fileType: fileType || 'other',
      uploadedBy: req.user.id,
      relatedOrder: relatedOrder || null,
      relatedClaim: relatedClaim || null,
      version: version || 1,
      notes: notes || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    // Generate preview for image files
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const previewPath = path.join(
          path.dirname(req.file.path),
          'preview-' + req.file.filename
        );

        // Generate preview using sharp
        await sharp(req.file.path)
          .resize(300, 300, { fit: 'inside' })
          .toFile(previewPath);

        // Update file with preview path
        file.previewPath = previewPath;
        await file.save();
      } catch (error) {
        console.error('Preview generation error:', error);
        // Continue even if preview generation fails
      }
    }

    res.status(201).json(file);
  });
});

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
  let query = {};

  // Filter by related order if provided
  if (req.query.order) {
    query.relatedOrder = req.query.order;
  }

  // Filter by related claim if provided
  if (req.query.claim) {
    query.relatedClaim = req.query.claim;
  }

  // Filter by file type if provided
  if (req.query.fileType) {
    query.fileType = req.query.fileType;
  }

  // Filter by uploader if provided
  if (req.query.uploadedBy) {
    query.uploadedBy = req.query.uploadedBy;
  }

  // Search by filename or tags
  if (req.query.search) {
    query.$or = [
      { originalname: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } },
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Get files with pagination
  const files = await File.find(query)
    .populate('uploadedBy', 'name email')
    .populate('relatedOrder', 'orderNumber title')
    .populate('relatedClaim', 'claimNumber title')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count for pagination
  const total = await File.countDocuments(query);

  res.json({
    files,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get file by ID
// @route   GET /api/files/:id
// @access  Private
const getFileById = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id)
    .populate('uploadedBy', 'name email')
    .populate('relatedOrder', 'orderNumber title')
    .populate('relatedClaim', 'claimNumber title')
    .populate('previousVersions');

  if (file) {
    res.json(file);
  } else {
    res.status(404);
    throw new Error('File not found');
  }
});

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
const downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Check if file exists on disk
  if (!fs.existsSync(file.path)) {
    res.status(404);
    throw new Error('File not found on server');
  }

  // Set content disposition header for download
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${file.originalname}"`
  );

  // Stream file to response
  const fileStream = fs.createReadStream(file.path);
  fileStream.pipe(res);
});

// @desc    Update file metadata
// @route   PUT /api/files/:id
// @access  Private
const updateFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Check if user has permission to update
  if (
    file.uploadedBy.toString() !== req.user.id &&
    req.user.role !== 'manager' &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this file');
  }

  // Update fields
  const { fileType, notes, tags, isActive } = req.body;

  if (fileType) file.fileType = fileType;
  if (notes) file.notes = notes;
  if (tags) file.tags = tags.split(',').map(tag => tag.trim());
  if (isActive !== undefined) file.isActive = isActive;

  const updatedFile = await file.save();

  res.json(updatedFile);
});

// @desc    Upload new version of a file
// @route   POST /api/files/:id/version
// @access  Private
const uploadNewVersion = asyncHandler(async (req, res) => {
  const originalFile = await File.findById(req.params.id);

  if (!originalFile) {
    res.status(404);
    throw new Error('Original file not found');
  }

  // Handle upload using multer middleware
  uploadMiddleware(req, res, async function (err) {
    if (err) {
      res.status(400);
      throw new Error(`Upload error: ${err.message}`);
    }

    // If no file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    // Create new file record for the new version
    const newVersion = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      fileType: originalFile.fileType,
      uploadedBy: req.user.id,
      relatedOrder: originalFile.relatedOrder,
      relatedClaim: originalFile.relatedClaim,
      version: originalFile.version + 1,
      previousVersions: [originalFile._id, ...originalFile.previousVersions],
      notes: req.body.notes || `New version of ${originalFile.originalname}`,
      tags: originalFile.tags,
    });

    // Generate preview for image files
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const previewPath = path.join(
          path.dirname(req.file.path),
          'preview-' + req.file.filename
        );

        // Generate preview using sharp
        await sharp(req.file.path)
          .resize(300, 300, { fit: 'inside' })
          .toFile(previewPath);

        // Update file with preview path
        newVersion.previewPath = previewPath;
        await newVersion.save();
      } catch (error) {
        console.error('Preview generation error:', error);
      }
    }

    // Mark original file as inactive
    originalFile.isActive = false;
    await originalFile.save();

    res.status(201).json(newVersion);
  });
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Check if user has permission to delete
  if (
    file.uploadedBy.toString() !== req.user.id &&
    req.user.role !== 'manager' &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this file');
  }

  // Instead of physically deleting, mark as inactive
  file.isActive = false;
  await file.save();

  res.json({ message: 'File marked as deleted' });
});

module.exports = {
  uploadFile,
  getFiles,
  getFileById,
  downloadFile,
  updateFile,
  uploadNewVersion,
  deleteFile,
  uploadMiddleware,
};