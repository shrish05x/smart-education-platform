const User = require('../models/User');
const Post = require('../models/Post');
const MentorshipSession = require('../models/MentorshipSession');
const CounselingSession = require('../models/CounselingSession');

// @desc    Get platform analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalCounselors = await User.countDocuments({ role: 'counselor' });
    const totalPosts = await Post.countDocuments();
    const totalMentorshipSessions = await MentorshipSession.countDocuments();
    const totalCounselingSessions = await CounselingSession.countDocuments();

    res.json({
      totalUsers,
      totalStudents,
      totalMentors,
      totalCounselors,
      totalPosts,
      totalMentorshipSessions,
      totalCounselingSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
