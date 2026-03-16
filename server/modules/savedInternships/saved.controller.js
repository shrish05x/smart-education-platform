const SavedInternship = require('./saved.model');

// @desc    Save internship
const saveInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;
    const userId = req.user._id;

    // Check if already saved
    const existing = await SavedInternship.findOne({ userId, internshipId });
    if (existing) {
      return res.status(400).json({ message: 'Internship already saved' });
    }

    const saved = new SavedInternship({
      userId,
      internshipId
    });

    await saved.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved internships
const getSavedInternships = async (req, res) => {
  try {
    const saved = await SavedInternship.find({ userId: req.user._id })
      .populate('internshipId')
      .sort({ savedAt: -1 });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave internship
const unsaveInternship = async (req, res) => {
  try {
    const saved = await SavedInternship.findById(req.params.id);
    if (!saved) return res.status(404).json({ message: 'Saved internship not found' });

    if (saved.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SavedInternship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveInternship,
  getSavedInternships,
  unsaveInternship
};