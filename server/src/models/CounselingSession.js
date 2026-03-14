const mongoose = require('mongoose');

const counselingSessionSchema = new mongoose.Schema({
  counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['individual', 'group'], default: 'individual' },
  topic: { type: String, default: '' },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 45 },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
  isConfidential: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CounselingSession', counselingSessionSchema);
