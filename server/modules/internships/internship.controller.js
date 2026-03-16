const Internship = require('./internship.model');
const Company = require('../companies/company.model');
const User = require('../../models/User');

// @desc    Get all internships
const getInternships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const internships = await Internship.find()
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments();

    res.json({
      internships,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internship by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('companyId')
      .populate('postedBy', 'name email');

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Increment views
    internship.views += 1;
    await internship.save();

    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Filter internships
const filterInternships = async (req, res) => {
  try {
    const { skills, location, stipend, duration, type } = req.query;
    let query = {};

    if (skills) {
      query.skillsRequired = { $in: skills.split(',') };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (stipend) {
      query.stipend = { $gte: parseInt(stipend) };
    }
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const internships = await Internship.find(query)
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended internships
const getRecommendedInternships = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('studentProfile');
    if (!user || !user.studentProfile || !user.studentProfile.skills) {
      return res.status(400).json({ message: 'User skills not found' });
    }

    const userSkills = user.studentProfile.skills;
    const internships = await Internship.find({
      skillsRequired: { $in: userSkills }
    })
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internships with deadlines soon
const getInternshipsByDeadlines = async (req, res) => {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const internships = await Internship.find({
      deadline: { $gte: now, $lte: soon }
    })
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ deadline: 1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create internship
const createInternship = async (req, res) => {
  try {
    const { companyId, role, description, requirements, skillsRequired, location, stipend, duration, type, deadline } = req.body;

    const internship = new Internship({
      companyId,
      role,
      description,
      requirements,
      skillsRequired,
      location,
      stipend,
      duration,
      type,
      deadline,
      postedBy: req.user._id
    });

    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update internship
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInternship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete internship
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  filterInternships,
  getRecommendedInternships,
  getInternshipsByDeadlines,
  createInternship,
  updateInternship,
  deleteInternship
};