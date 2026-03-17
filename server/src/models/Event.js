const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 3000 },
  type: { type: String, enum: ['contest', 'quiz', 'doubt_session', 'challenge'], required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number, default: 100 },
  prize: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
}, { timestamps: true });

eventSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
