import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  extrait: {
    type: String,
    default: ''
  },
  statut: {
    type: String,
    enum: ['gratuit', 'payant'],
    default: 'gratuit'
  },
  prix: {
    type: Number,
    default: 0
  },
  fichier_pdf: {
    type: String,
    default: ''
  },
  fichier_pdf_public_id: {
    type: String,
    default: ''
  },
  couverture: {
    type: String,
    default: ''
  },
  couverture_public_id: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Book', bookSchema);
