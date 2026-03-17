const Connection = require('../models/Connection');
const User = require('../models/User');
const { awardPoints } = require('../services/gamificationService');
const { createNotification } = require('../services/notificationService');
const { getPeerSuggestions } = require('../services/suggestionService');

// @desc    Send connection request
// @route   POST /api/connections/request
// @access  Private
const sendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!receiver.isOpenToConnect) {
      return res.status(403).json({ success: false, message: 'This user is not accepting connections' });
    }

    // Check existing connection in either direction
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      return res.status(409).json({ success: false, message: `Connection already exists with status: ${existing.status}` });
    }

    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
      message: message ? message.substring(0, 200) : ''
    });

    // Update receiver's pending count
    receiver.pendingRequestsCount += 1;
    await receiver.save();

    // Award points to sender
    await awardPoints(senderId, 'send_connection');

    // Send notification
    await createNotification({
      recipient: receiverId,
      sender: senderId,
      type: 'connection_request',
      connectionId: connection._id,
      message: `${req.user.name} sent you a connection request.`
    });

    res.status(201).json({ success: true, data: connection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ success: false, message: 'Connection not found' });

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is not pending' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Add to each other's network and update metrics
    await User.findByIdAndUpdate(connection.sender, {
      $push: { connections: connection.receiver },
      $inc: { connectionCount: 1 }
    });

    await User.findByIdAndUpdate(connection.receiver, {
      $push: { connections: connection.sender },
      $inc: { connectionCount: 1, pendingRequestsCount: -1 }
    });

    // Award points
    await awardPoints(connection.sender, 'accept_connection');
    await awardPoints(connection.receiver, 'accept_connection');

    // Notify sender
    await createNotification({
      recipient: connection.sender,
      sender: connection.receiver,
      type: 'connection_accepted',
      connectionId: connection._id,
      message: `${req.user.name} accepted your connection request!`
    });

    res.json({ success: true, data: connection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
const rejectRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ success: false, message: 'Connection not found' });

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    connection.status = 'rejected';
    await connection.save();

    // Decrease pending counts for receiver
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { pendingRequestsCount: -1 }
    });

    // Silent reject, no notification
    res.json({ success: true, data: connection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Block user connection
// @route   PUT /api/connections/:id/block
// @access  Private
const blockUser = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ success: false, message: 'Not found' });

    if (connection.receiver.toString() !== req.user._id.toString() && connection.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const wasAccepted = connection.status === 'accepted';
    connection.status = 'blocked';
    await connection.save();

    // Cleanup arrays
    if (wasAccepted) {
      await User.findByIdAndUpdate(connection.sender, {
        $pull: { connections: connection.receiver },
        $inc: { connectionCount: -1 }
      });
      await User.findByIdAndUpdate(connection.receiver, {
        $pull: { connections: connection.sender },
        $inc: { connectionCount: -1 }
      });
    } else if (connection.status === 'pending' && connection.receiver.toString() === req.user._id.toString()) {
      await User.findByIdAndUpdate(connection.receiver, {
        $inc: { pendingRequestsCount: -1 }
      });
    }

    res.json({ success: true, data: connection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove/Unfriend connection
// @route   DELETE /api/connections/:id
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ success: false, message: 'Not found' });

    if (connection.receiver.toString() !== req.user._id.toString() && connection.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const wasAccepted = connection.status === 'accepted';
    const wasPending = connection.status === 'pending';
    const receiverId = connection.receiver;

    await connection.deleteOne();

    if (wasAccepted) {
      await User.findByIdAndUpdate(connection.sender, {
        $pull: { connections: connection.receiver },
        $inc: { connectionCount: -1 }
      });
      await User.findByIdAndUpdate(connection.receiver, {
        $pull: { connections: connection.sender },
        $inc: { connectionCount: -1 }
      });
    } else if (wasPending) {
      await User.findByIdAndUpdate(receiverId, {
        $inc: { pendingRequestsCount: -1 }
      });
    }

    res.json({ success: true, message: 'Removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all pending incoming requests
// @route   GET /api/connections/requests
// @access  Private
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ receiver: req.user._id, status: 'pending' })
      .populate('sender', 'name profileImage bio skills goals reputation badges connectionCount')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all pending outgoing requests
// @route   GET /api/connections/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ sender: req.user._id, status: 'pending' })
      .populate('receiver', 'name profileImage bio skills')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get accepted network
// @route   GET /api/connections/my-network
// @access  Private
const getMyNetwork = async (req, res) => {
  try {
    const { search, skills } = req.query;
    
    // We already have User's `connections` array, but querying Connection table
    // gives us precise history and timestamps of connection.
    const connections = await Connection.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'accepted'
    }).populate('sender receiver', 'name profileImage bio skills goals reputation badges connections connectionCount');

    // Flatten logic
    let friends = connections.map(c => {
      const isSender = c.sender._id.toString() === req.user._id.toString();
      const friend = isSender ? c.receiver : c.sender;
      return {
        ...friend.toObject(),
        connectionId: c._id,
        connectedAt: c.updatedAt
      };
    });

    // Filters
    if (search) {
      const regex = new RegExp(search, 'i');
      friends = friends.filter(f => regex.test(f.name));
    }
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim().toLowerCase());
      friends = friends.filter(f => f.skills.some(s => skillArr.includes(s.toLowerCase())));
    }

    // Mutuals
    const myConnsSet = new Set(req.user.connections?.map(id => id.toString()));
    friends = friends.map(f => {
      const mutuals = f.connections?.filter(id => myConnsSet.has(id.toString())).length || 0;
      const { connections: _ignored, ...cleaned } = f; // remove array of ids payload
      return { ...cleaned, mutualCount: mutuals };
    });

    res.json({ success: true, data: friends });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get peer match suggestions
// @route   GET /api/connections/suggestions
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const topMatches = await getPeerSuggestions(req.user._id);
    res.json({ success: true, data: topMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get connection status with a specific user
// @route   GET /api/connections/status/:userId
// @access  Private
const getConnectionStatus = async (req, res) => {
  try {
    const currentId = req.user._id.toString();
    const otherId = req.params.userId;

    if (currentId === otherId) {
      return res.json({ success: true, data: { status: 'self', connectionId: null } });
    }

    const connection = await Connection.findOne({
      $or: [
        { sender: currentId, receiver: otherId },
        { sender: otherId, receiver: currentId }
      ]
    });

    if (!connection) {
      return res.json({ success: true, data: { status: 'not_connected', connectionId: null } });
    }

    if (connection.status === 'pending') {
      const isSender = connection.sender.toString() === currentId;
      return res.json({
        success: true,
        data: {
          status: isSender ? 'pending_sent' : 'pending_received',
          connectionId: connection._id
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: connection.status, // "accepted", "rejected", "blocked"
        connectionId: connection._id
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  blockUser,
  removeConnection,
  getPendingRequests,
  getSentRequests,
  getMyNetwork,
  getSuggestions,
  getConnectionStatus
};
