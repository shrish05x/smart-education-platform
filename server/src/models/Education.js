const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  courseBranch: { type: String, trim: true },
  yearSemester: { type: String, trim: true },
  collegeName: { type: String, trim: true },
  previousQualification10th: { type: String, trim: true }, // e.g. "95% CBSE" or just board/marks
  previousQualification12th: { type: String, trim: true }, // e.g. "90% CBSE"
  enrollmentRollNumber: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
