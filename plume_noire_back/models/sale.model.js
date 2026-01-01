import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  buyer_email: {
    type: String,
    required: true
  },
  created_at: { 
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Sale', saleSchema);
