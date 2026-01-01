import mongoose from 'mongoose';

const venteSchema = new mongoose.Schema({
  livre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: true
  },
  email_acheteur: {
    type: String,
    required: true,
    lowercase: true
  },
  prix_vente: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'annulee'],
    default: 'confirmee'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Vente', venteSchema);