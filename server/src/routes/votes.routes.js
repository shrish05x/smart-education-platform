const express = require('express');
const router = express.Router();
const { castVote, getUserVote } = require('../controllers/voteController');
const { protect } = require('../middlewares/auth.middleware');

// Optional auth for getUserVote
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err && decoded) req.user = await User.findById(decoded.id).select('-password');
      next();
    });
  } else next();
};

router.post('/', protect, castVote);
router.get('/:postId', optionalAuth, getUserVote);

module.exports = router;
