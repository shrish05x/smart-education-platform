const mongoose = require('mongoose');

const counselorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: [{ type: String }],
  qualifications: [{ type: String }],
  experience: { type: String, default: '' },
  bio: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  totalSessions: { type: Number, default: 0 },
  availability: [{ day: String, startTime: String, endTime: String }],
}, { timestamps: true });

module.exports = mongoose.model('CounselorProfile', counselorProfileSchema);
