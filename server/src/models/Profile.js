const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  nationality: { type: String, trim: true },
  profilePhoto: { type: String, default: '' } // URL to the photo
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
