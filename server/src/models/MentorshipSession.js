const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  description: { type: String, default: '' },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
