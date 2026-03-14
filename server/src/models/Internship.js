const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  type: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'remote' },
  duration: { type: String, default: '' },
  stipend: { type: String, default: 'Unpaid' },
  skills: [{ type: String }],
  requirements: [{ type: String }],
  applicationDeadline: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
