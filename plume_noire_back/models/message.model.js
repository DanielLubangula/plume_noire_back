
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  sujet: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['non_lu', 'lu', 'repondu'],
    default: 'non_lu' 
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);