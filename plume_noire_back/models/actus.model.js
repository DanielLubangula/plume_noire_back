import mongoose from 'mongoose';

const actusSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  image_public_id: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

export default mongoose.model('Actu', actusSchema);
