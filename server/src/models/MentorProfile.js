const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expertise: [{ type: String }],
  experience: { type: String, default: '' },
  company: { type: String, default: '' },
  designation: { type: String, default: '' },
  bio: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  availability: [{ day: String, startTime: String, endTime: String }],
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
