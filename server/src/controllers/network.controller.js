const User = require('../models/User');

/**
 * @desc    Get discoverable community network
 * @route   GET /api/network/discover
 * @access  Private
 */
const getDiscoverableUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('friends friendRequestsSent friendRequestsReceived');
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude current user, existing friends, and users with pending requests
    const excludedIds = [
      req.user._id,
      ...currentUser.friends,
      ...currentUser.friendRequestsSent,
      ...currentUser.friendRequestsReceived
    ];

    const users = await User.find({ _id: { $nin: excludedIds } })
      .select('name university profileImage role')
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Send Friend Request
 * @route   POST /api/network/request/:userId
 * @access  Private
 */
const sendFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: 'Target user not found' });

    // Check if request already exists or they are already friends
    if (currentUser.friends.includes(targetUserId) || 
        currentUser.friendRequestsSent.includes(targetUserId) || 
        currentUser.friendRequestsReceived.includes(targetUserId)) {
      return res.status(400).json({ message: 'Request already sent or connection exists' });
    }

    currentUser.friendRequestsSent.push(targetUserId);
    targetUser.friendRequestsReceived.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Accept Friend Request
 * @route   POST /api/network/accept/:userId
 * @access  Private
 */
const acceptFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser.friendRequestsReceived.includes(targetUserId)) {
      return res.status(400).json({ message: 'No pending request found' });
    }

    // Add to friends
    currentUser.friends.push(targetUserId);
    targetUser.friends.push(currentUserId);

    // Remove from request lists
    currentUser.friendRequestsReceived.pull(targetUserId);
    targetUser.friendRequestsSent.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Reject Friend Request
 * @route   POST /api/network/reject/:userId
 * @access  Private
 */
const rejectFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Remove from request lists
    if (currentUser) currentUser.friendRequestsReceived.pull(targetUserId);
    if (targetUser) targetUser.friendRequestsSent.pull(currentUserId);

    await currentUser.save();
    if(targetUser) await targetUser.save();

    res.json({ message: 'Friend request rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get Network Connections (Friends) and Requests
 * @route   GET /api/network/connections
 * @access  Private
 */
const getNetwork = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name profileImage university role')
      .populate('friendRequestsReceived', 'name profileImage university role')
      .populate('friendRequestsSent', 'name profileImage university role');
      
    res.json({
      friends: user.friends,
      incomingRequests: user.friendRequestsReceived,
      outgoingRequests: user.friendRequestsSent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDiscoverableUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getNetwork
};
