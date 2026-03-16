const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  fileURL: {
    type: String,
    default: '',
  },
  resourceType: {
    type: String,
    enum: {
      values: ['pdf', 'note', 'link'],
      message: 'Resource type must be pdf, note, or link',
    },
    required: [true, 'Resource type is required'],
  },
  uploadedBy: {
    type: String,
    default: 'Anonymous',
  },
  noteContent: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Text index for search
resourceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
