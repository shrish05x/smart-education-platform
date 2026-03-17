const express = require('express');
const router = express.Router();
const c = require('../controllers/userController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/leaderboard', c.getLeaderboard);
router.get('/peer-match', protect, c.getPeerMatches);
router.get('/:id/profile', c.getUserProfile);
router.put('/:id/profile', protect, c.updateProfile);

module.exports = router;
