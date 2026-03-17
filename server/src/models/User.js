const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  profileImage: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  skills: [{ type: String, trim: true }],
  goals: { type: String, maxlength: 300, default: '' },
  reputation: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  answerCount: { type: Number, default: 0 },
  badges: [{
    name: { type: String },
    icon: { type: String },
    awardedAt: { type: Date, default: Date.now }
  }],
  // --- New Connection System Fields ---
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionCount: { type: Number, default: 0 },
  pendingRequestsCount: { type: Number, default: 0 },
  isOpenToConnect: { type: Boolean, default: true },
  lookingFor: [{ type: String, trim: true }], // e.g. ['study partner', 'project teammate']
  // ------------------------------------
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
