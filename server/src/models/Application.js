const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  resumeURL: { type: String },
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'accepted'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);