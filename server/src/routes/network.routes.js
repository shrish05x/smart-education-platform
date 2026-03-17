const express = require('express');
const router = express.Router();
const {
  getDiscoverableUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getNetwork
} = require('../controllers/network.controller');
const { protect } = require('../middlewares/auth.middleware');

// All network routes are protected
router.use(protect);

router.get('/discover', getDiscoverableUsers);
router.get('/connections', getNetwork);
router.post('/request/:userId', sendFriendRequest);
router.post('/accept/:userId', acceptFriendRequest);
router.post('/reject/:userId', rejectFriendRequest);

module.exports = router;
