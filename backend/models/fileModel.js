const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['design', 'reference', 'proof', 'claim', 'other'],
      default: 'other',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    relatedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
    },
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    previewPath: {
      type: String,
    },
    metadata: {
      width: Number,
      height: Number,
      colorSpace: String,
      resolution: Number,
      additionalInfo: Object,
    },
    tags: [String],
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('File', fileSchema);