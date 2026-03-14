const User = require('../models/User');
const Post = require('../models/Post');
const MentorshipSession = require('../models/MentorshipSession');
const CounselingSession = require('../models/CounselingSession');

const getPlatformStats = async () => {
  const [totalUsers, totalStudents, totalMentors, totalCounselors, totalPosts, totalMentorships, totalCounselings] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      User.countDocuments({ role: 'counselor' }),
      Post.countDocuments(),
      MentorshipSession.countDocuments(),
      CounselingSession.countDocuments(),
    ]);

  return { totalUsers, totalStudents, totalMentors, totalCounselors, totalPosts, totalMentorships, totalCounselings };
};

module.exports = { getPlatformStats };
