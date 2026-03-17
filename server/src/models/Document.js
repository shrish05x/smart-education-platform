const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  idProof: { type: String, default: '' }, // URL to ID Proof
  resume: { type: String, default: '' }, // URL to Resume
  certificates: [{ type: String, trim: true }] // Array of URLs to certificates
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
