const MentorshipSession = require('../models/MentorshipSession');

// @desc    Create mentorship session
const createSession = async (req, res) => {
  try {
    const session = await MentorshipSession.create({ ...req.body, student: req.user._id });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({
      $or: [{ student: req.user._id }, { mentor: req.user._id }],
    }).populate('mentor student', 'name email avatar');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session status
const updateSession = async (req, res) => {
  try {
    const session = await MentorshipSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSession, getSessions, updateSession };
