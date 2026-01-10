import { Schema, model, models } from 'mongoose';

const ReceiptSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Receipt image URL is required'],
  },
  publicId: {
    type: String, // Cloudinary Public ID for easier deletion later
  },
  merchantName: {
    type: String,
    default: 'Unknown Merchant',
  },
  totalAmount: {
    type: Number,
    default: 0.00,
  },
  transactionDate: {
    type: Date,
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  isProcessed: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Receipt = models.Receipt || model('Receipt', ReceiptSchema);

export default Receipt;