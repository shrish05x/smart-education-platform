const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// GET /api/users/:id/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [postCount, commentCount, recentPosts] = await Promise.all([
      Post.countDocuments({ author: user._id }),
      Comment.countDocuments({ author: user._id }),
      Post.find({ author: user._id }).sort({ createdAt: -1 }).limit(5).select('title upvotes downvotes commentCount tags type createdAt'),
    ]);

    res.json({ success: true, data: { user, postCount, commentCount, recentPosts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id/profile
exports.updateProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to edit this profile' });

    const { bio, skills, goals, name } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (bio !== undefined) update.bio = bio.trim().slice(0, 500);
    if (goals !== undefined) update.goals = goals.trim().slice(0, 300);
    if (skills !== undefined) update.skills = (Array.isArray(skills) ? skills : skills.split(',')).map((s) => s.trim()).filter(Boolean).slice(0, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'weekly' } = req.query;
    const sortField = period === 'all' ? 'points' : 'points'; // Could use time-window in a more complex system
    const users = await User.find({})
      .select('name profileImage points reputation badges postCount answerCount')
      .sort({ [sortField]: -1 })
      .limit(20);

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/peer-match
exports.getPeerMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('skills goals');
    if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });

    const query = {
      _id: { $ne: req.user._id },
      $or: []
    };

    if (currentUser.skills?.length) query.$or.push({ skills: { $in: currentUser.skills } });
    if (currentUser.goals) query.$or.push({ goals: { $regex: currentUser.goals.slice(0, 20), $options: 'i' } });

    // Fallback: return recent active users if no skills/goals overlap
    if (!query.$or.length) {
      const users = await User.find({ _id: { $ne: req.user._id } })
        .select('name profileImage skills goals reputation points badges')
        .sort({ points: -1 })
        .limit(5);
      return res.json({ success: true, data: users });
    }

    const matches = await User.find(query)
      .select('name profileImage skills goals reputation points badges')
      .sort({ points: -1 })
      .limit(5);

    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
