const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  downloadFile,
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// All authenticated users can upload and view files
router.route('/')
  .post(protect, uploadFile)
  .get(protect, getFiles);

router.route('/:id')
  .get(protect, getFileById)
  .put(protect, updateFile)
  .delete(protect, deleteFile);

// Download file route
router.route('/:id/download')
  .get(protect, downloadFile);

module.exports = router;