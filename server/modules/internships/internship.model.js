const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  skillsRequired: [String],
  location: { type: String, required: true },
  stipend: { type: Number, required: true },
  duration: { type: String, required: true },
  type: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true },
  deadline: { type: Date, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  applicantsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Internship', internshipSchema);