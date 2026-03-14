const MentorshipSession = require('../models/MentorshipSession');

const createSession = async (data) => {
  return await MentorshipSession.create(data);
};

const getSessionsByUser = async (userId) => {
  return await MentorshipSession.find({
    $or: [{ student: userId }, { mentor: userId }],
  }).populate('mentor student', 'name email avatar');
};

const updateSession = async (id, data) => {
  return await MentorshipSession.findByIdAndUpdate(id, data, { new: true });
};

module.exports = { createSession, getSessionsByUser, updateSession };
