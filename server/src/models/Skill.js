const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  technicalSkills: [{ type: String, trim: true }], // Array of strings (e.g. ['React', 'Node.js'])
  interests: [{ type: String, trim: true }],
  hobbies: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
