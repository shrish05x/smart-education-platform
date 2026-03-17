const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorProfile',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: [true, 'Please provide a scheduled session date']
  },
  duration: {
    type: Number,
    default: 60
  },
  notes: {
    type: String,
    default: ''
  },
  requestMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
