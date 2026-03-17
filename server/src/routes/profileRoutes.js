const express = require('express');
const router = express.Router();
const { getProfile, updateProfileSection, getCompletionStatus } = require('../controllers/profileController');
// Assuming protect middleware exists
const { protect } = require('../middlewares/auth.middleware');

// Get entire user profile
router.get('/:userId', protect, getProfile);

// Update a specific section of the profile (e.g. 'contact', 'education')
router.put('/update', protect, updateProfileSection);

// Get completion percentage and verified status
router.get('/completion-status/:userId', protect, getCompletionStatus);

module.exports = router;
