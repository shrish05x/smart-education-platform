const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  institution: { type: String, default: '' },
  grade: { type: String, default: '' },
  subjects: [{ type: String }],
  interests: [{ type: String }],
  bio: { type: String, default: '' },
  studyGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' }],
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
