const Internship = require('../models/Internship');

// @desc    Get all internships
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internship by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('postedBy', 'name');
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create internship
const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to internship
const applyToInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    if (internship.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied' });
    }
    internship.applicants.push(req.user._id);
    await internship.save();
    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInternships, getInternshipById, createInternship, applyToInternship };
