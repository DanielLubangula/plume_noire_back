import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
  network: { type: String, required: true },
  url: { type: String, required: true }
});

const authorSchema = new mongoose.Schema({
  biographie: { type: String, default: '' },
  photo: { type: String, default: '' },
  photo_public_id: { type: String, default: '' },
  email_contact: { type: String, default: '' },
  social_links: { type: [socialSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

export default mongoose.model('Author', authorSchema);
