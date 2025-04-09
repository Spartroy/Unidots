const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title for the order'],
    },
    description: {
      type: String,
    },
    orderType: {
      type: String,
      required: [true, 'Please specify the order type'],
      enum: ['New Design', 'Reprint', 'Modification', 'Other'],
    },
    specifications: {
      material: {
        type: String,
        required: [true, 'Please specify the material'],
      },
      dimensions: {
        width: {
          type: Number,
          required: [true, 'Please specify the width'],
        },
        height: {
          type: Number,
          required: [true, 'Please specify the height'],
        },
        unit: {
          type: String,
          enum: ['mm', 'cm', 'inch'],
          default: 'mm',
        },
      },
      quantity: {
        type: Number,
        required: [true, 'Please specify the quantity'],
      },
      colors: {
        type: Number,
        required: [true, 'Please specify the number of colors'],
      },
      finishType: {
        type: String,
        enum: ['Matte', 'Glossy', 'Semi-Glossy', 'None'],
        default: 'None',
      },
      additionalDetails: {
        type: String,
      },
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    status: {
      type: String,
      required: true,
      enum: [
        'Submitted',
        'In Review',
        'Approved',
        'In Prepress',
        'Ready for Production',
        'In Production',
        'Completed',
        'Delivered',
        'Cancelled',
        'On Hold',
      ],
      default: 'Submitted',
    },
    stages: {
      review: {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'N/A'],
          default: 'Pending',
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        startDate: Date,
        completionDate: Date,
        notes: String,
      },
      prepress: {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'N/A'],
          default: 'Pending',
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        startDate: Date,
        completionDate: Date,
        notes: String,
      },
      production: {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'N/A'],
          default: 'Pending',
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        startDate: Date,
        completionDate: Date,
        notes: String,
      },
      delivery: {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed', 'N/A'],
          default: 'Pending',
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        startDate: Date,
        completionDate: Date,
        trackingNumber: String,
        deliveryMethod: String,
        notes: String,
      },
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a deadline'],
    },
    cost: {
      estimatedCost: {
        type: Number,
      },
      finalCost: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      paymentStatus: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
        default: 'Pending',
      },
    },
    history: [
      {
        action: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        details: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.orderNumber = `UNI-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);