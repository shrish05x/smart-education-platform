const mongoose = require('mongoose');

const groupResourceSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    resourceType: {
      type: String,
      enum: ['pdf', 'note', 'link', 'image'],
      required: true,
    },
    fileURL: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroupResource', groupResourceSchema);
