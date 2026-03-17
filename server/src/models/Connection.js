const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'blocked'], 
    default: 'pending' 
  },
  message: { type: String, maxlength: 200 }
}, { timestamps: true });

// Prevent duplicate connections regardless of direction
// However, since sender/receiver order matters for "who sent it", 
// we ensure a unique compound index on sender+receiver.
// Application logic will enforce A->B and B->A uniqueness
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
