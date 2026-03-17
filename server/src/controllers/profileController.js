const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// GET /api/users/:id/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [postCount, commentCount, recentPosts] = await Promise.all([
      Post.countDocuments({ author: user._id }),
      Comment.countDocuments({ author: user._id }),
      Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title upvotes downvotes commentCount createdAt tags'),
    ]);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          reputation: user.reputation || 0,
          createdAt: user.createdAt,
        },
        postCount,
        commentCount,
        recentPosts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUserProfile };
