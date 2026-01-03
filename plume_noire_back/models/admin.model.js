import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
  network: { type: String, required: true },
  url: { type: String, required: true }
});

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  nom: { type: String, default: '' },
  biographie: { type: String, default: '' },
  short_biographie: { type: String, default: '' },
  email_contact: { type: String, default: '' },
  message_accroche: { type: String, default: '' },
  photo: { type: String, default: '' },
  photo_public_id: { type: String, default: '' },
  social_links: { type: [socialSchema], default: [] },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: { type: Date }
});

export default mongoose.model('Admin', adminSchema);