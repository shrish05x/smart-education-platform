const CounselingSession = require('../models/CounselingSession');

const createSession = async (data) => {
  return await CounselingSession.create(data);
};

const getSessionsByUser = async (userId) => {
  return await CounselingSession.find({
    $or: [{ student: userId }, { counselor: userId }],
  }).populate('counselor student', 'name email avatar');
};

const updateSession = async (id, data) => {
  return await CounselingSession.findByIdAndUpdate(id, data, { new: true });
};

module.exports = { createSession, getSessionsByUser, updateSession };
