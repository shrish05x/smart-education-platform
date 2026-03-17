const mongoose = require('mongoose');

const weeklyChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 3000 },
  subject: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  points: { type: Number, default: 50 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  submissions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answer: { type: String },
    link: { type: String },
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 }
  }],
}, { timestamps: true });

weeklyChallengeSchema.index({ startDate: -1 });

module.exports = mongoose.model('WeeklyChallenge', weeklyChallengeSchema);
