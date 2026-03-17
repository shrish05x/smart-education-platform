const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  hackathons: [{ type: String, trim: true }], // Array of strings describing hackathon achievements
  technicalEvents: [{ type: String, trim: true }], // Events participated/won
  clubMemberships: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
