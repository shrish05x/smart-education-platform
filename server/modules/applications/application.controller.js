const Application = require('./application.model');
const Internship = require('../internships/internship.model');

// @desc    Apply to internship
const applyToInternship = async (req, res) => {
  try {
    const { internshipId, resumeURL } = req.body;
    const userId = req.user._id;

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, internshipId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this internship' });
    }

    const application = new Application({
      userId,
      internshipId,
      resumeURL
    });

    await application.save();

    // Increment applicants count
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicantsCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internshipId')
      .populate('userId', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Check if user owns the application
    if (application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToInternship,
  getUserApplications,
  getApplicationById
};