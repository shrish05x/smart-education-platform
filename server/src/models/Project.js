const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  techStack: [{ type: String, trim: true }] // Array of strings
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
