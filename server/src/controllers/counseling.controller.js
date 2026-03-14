const CounselingSession = require('../models/CounselingSession');

// @desc    Create counseling session
const createSession = async (req, res) => {
  try {
    const session = await CounselingSession.create({ ...req.body, student: req.user._id });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's counseling sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await CounselingSession.find({
      $or: [{ student: req.user._id }, { counselor: req.user._id }],
    }).populate('counselor student', 'name email avatar');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update counseling session
const updateSession = async (req, res) => {
  try {
    const session = await CounselingSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSession, getSessions, updateSession };
