import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'hired', 'rejected'],
      message: 'Status must be pending, hired, or rejected'
    },
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index to optimize queries by gigId and status
bidSchema.index({ gigId: 1, status: 1 });

export default mongoose.model('Bid', bidSchema);