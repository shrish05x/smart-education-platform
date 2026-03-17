const mongoose = require('mongoose');

const userInternshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { type: String, enum: ['Completed', 'Ongoing'], required: true },
  companyName: { type: String, trim: true, required: true },
  duration: { type: String, trim: true }, // e.g. "6 Months"
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
  stipend: { type: String, trim: true }, // e.g. "10k/month" or "Unpaid"
  technologyUsed: [{ type: String, trim: true }] // Array of strings
}, { timestamps: true });

module.exports = mongoose.model('UserInternship', userInternshipSchema);
