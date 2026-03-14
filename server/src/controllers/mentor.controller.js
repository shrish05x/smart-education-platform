const MentorProfile = require('../models/MentorProfile');
const User = require('../models/User');

// @desc    Get all mentors
const getMentors = async (req, res) => {
  try {
    const mentors = await MentorProfile.find().populate('user', 'name email avatar');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mentor by ID
const getMentorById = async (req, res) => {
  try {
    const mentor = await MentorProfile.findById(req.params.id).populate('user', 'name email avatar');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Update mentor profile
const updateMentorProfile = async (req, res) => {
  try {
    let mentor = await MentorProfile.findOne({ user: req.user._id });
    if (mentor) {
      mentor = await MentorProfile.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
    } else {
      mentor = await MentorProfile.create({ ...req.body, user: req.user._id });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMentors, getMentorById, updateMentorProfile };
