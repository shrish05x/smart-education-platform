const express = require('express');
const router = express.Router();
const { getMentors, getMentorById, updateMentorProfile } = require('../controllers/mentor.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getMentors);
router.get('/:id', getMentorById);
router.put('/profile', protect, authorize('mentor'), updateMentorProfile);

module.exports = router;
