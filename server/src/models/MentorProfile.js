const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String
  }],
  industry: {
    type: String,
    required: false,
    default: 'General'
  },
  experience: {
    type: Number,
    required: false,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  sessionCount: {
    type: Number,
    default: 0
  },
  linkedIn: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Text index for search functionality on name and expertise
mentorProfileSchema.index({ name: 'text', expertise: 'text' });

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
