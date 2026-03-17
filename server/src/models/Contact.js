const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phoneNumber: { type: String, trim: true },
  currentAddress: { type: String, trim: true },
  permanentAddress: { type: String, trim: true },
  linkedInUrl: { type: String, trim: true },
  portfolioUrl: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
