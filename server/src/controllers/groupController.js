const StudyGroup = require('../models/StudyGroup');
const GroupMessage = require('../models/GroupMessage');
const GroupResource = require('../models/GroupResource');
const crypto = require('crypto');

// ─── GET /api/groups ─────────────────────────────────────────────────────────
const getGroups = async (req, res) => {
  try {
    const { search, subject, joined, sort } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    if (joined) {
      query.members = joined;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'members') sortOption = { memberCount: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const groups = await StudyGroup.find(query)
      .sort(sortOption)
      .populate('creator', 'name profileImage')
      .populate('members', 'name profileImage')
      .lean();

    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/groups ────────────────────────────────────────────────────────
const createGroup = async (req, res) => {
  try {
    const { name, subject, description, tags, maxMembers, isPrivate, coverColor } = req.body;

    if (!name || !subject || !description) {
      return res.status(400).json({ success: false, message: 'Name, subject, and description are required' });
    }

    const existing = await StudyGroup.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A group with this name already exists' });
    }

    const groupData = {
      name: name.trim(),
      subject,
      description,
      tags: tags || [],
      maxMembers: maxMembers || 50,
      isPrivate: isPrivate || false,
      coverColor: coverColor || '#5865f2',
      creator: req.user._id,
      members: [req.user._id],
      memberCount: 1,
    };

    if (isPrivate) {
      groupData.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    const group = await StudyGroup.create(groupData);
    await group.populate('creator', 'name profileImage');
    await group.populate('members', 'name profileImage');

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A group with this name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/groups/:id ─────────────────────────────────────────────────────
const getGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('creator', 'name profileImage')
      .populate('members', 'name profileImage');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/groups/join ───────────────────────────────────────────────────
const joinGroup = async (req, res) => {
  try {
    const { groupId, inviteCode } = req.body;

    if (!groupId) {
      return res.status(400).json({ success: false, message: 'Group ID is required' });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if already a member
    if (group.members.map(String).includes(String(req.user._id))) {
      return res.status(409).json({ success: false, message: 'You are already a member of this group' });
    }

    // Check max members
    if (group.members.length >= group.maxMembers) {
      return res.status(403).json({ success: false, message: 'Group is full' });
    }

    // Check invite code for private groups
    if (group.isPrivate) {
      if (!inviteCode || inviteCode.toUpperCase() !== group.inviteCode) {
        return res.status(403).json({ success: false, message: 'Invalid invite code' });
      }
    }

    group.members.push(req.user._id);
    group.memberCount = group.members.length;
    await group.save();

    await group.populate('creator', 'name profileImage');
    await group.populate('members', 'name profileImage');

    // Create a system message
    await GroupMessage.create({
      groupId: group._id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.profileImage,
      content: `${req.user.name} joined the group`,
      type: 'system',
    });

    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/groups/:id/leave ──────────────────────────────────────────────
const leaveGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (String(group.creator) === String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Creator cannot leave the group. Delete it instead.' });
    }

    group.members = group.members.filter((m) => String(m) !== String(req.user._id));
    group.memberCount = group.members.length;
    await group.save();

    await GroupMessage.create({
      groupId: group._id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.profileImage,
      content: `${req.user.name} left the group`,
      type: 'system',
    });

    res.json({ success: true, message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/groups/:id ──────────────────────────────────────────────────
const deleteGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (String(group.creator) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the group creator can delete this group' });
    }

    await StudyGroup.findByIdAndDelete(req.params.id);
    await GroupMessage.deleteMany({ groupId: req.params.id });
    await GroupResource.deleteMany({ groupId: req.params.id });

    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/groups/:id/messages ────────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.find({ groupId: req.params.id })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/groups/:id/messages ───────────────────────────────────────────
const postMessage = async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message exceeds 1000 character limit' });
    }

    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const message = await GroupMessage.create({
      groupId: req.params.id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.profileImage,
      content: content.trim(),
      type: type || 'text',
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/groups/:id/resources ──────────────────────────────────────────
const shareResource = async (req, res) => {
  try {
    const { title, description, resourceType, fileURL, subject } = req.body;

    if (!title || !resourceType) {
      return res.status(400).json({ success: false, message: 'Title and resource type are required' });
    }

    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const resource = await GroupResource.create({
      groupId: req.params.id,
      uploadedBy: req.user._id,
      uploaderName: req.user.name,
      title,
      description: description || '',
      resourceType,
      fileURL: fileURL || '',
      subject: subject || group.subject,
    });

    // Create a resource-type message in chat
    const message = await GroupMessage.create({
      groupId: req.params.id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.profileImage,
      content: `📎 ${req.user.name} shared "${title}"`,
      type: 'resource',
      resourceRef: resource._id,
    });

    res.status(201).json({ success: true, data: { resource, message } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/groups/:id/resources ───────────────────────────────────────────
const getResources = async (req, res) => {
  try {
    const resources = await GroupResource.find({ groupId: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGroups,
  createGroup,
  getGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  getMessages,
  postMessage,
  shareResource,
  getResources,
};
