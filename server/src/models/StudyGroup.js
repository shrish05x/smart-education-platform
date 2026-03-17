const mongoose = require('mongoose');
const crypto = require('crypto');

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      unique: true,
      trim: true,
      maxlength: [60, 'Group name cannot exceed 60 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'Computer Science',
        'Literature',
        'Economics',
        'Other',
      ],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    memberCount: {
      type: Number,
      default: 1,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    inviteCode: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    maxMembers: {
      type: Number,
      default: 50,
      min: 2,
      max: 200,
    },
    coverColor: {
      type: String,
      default: '#5865f2',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate invite code for private groups before save
studyGroupSchema.pre('save', function (next) {
  if (this.isPrivate && !this.inviteCode) {
    this.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  this.memberCount = this.members.length;
  next();
});

// Update memberCount on members change
studyGroupSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.$push && update.$push.members) {
    this.set({ memberCount: (this.get('memberCount') || 1) + 1 });
  }
  next();
});

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
