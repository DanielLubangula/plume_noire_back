import mongoose from 'mongoose';

const livreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  extrait: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['gratuit', 'payant'],
    required: true
  },
  prix: {
    type: Number,
    required: function() {
      return this.statut === 'payant';
    },
    min: 0
  },
  fichier_pdf: {
    type: String,
    required: true
  },
  couverture: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

livreSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('Livre', livreSchema);