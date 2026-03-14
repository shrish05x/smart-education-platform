const express = require('express');
const router = express.Router();
const { getInternships, getInternshipById, createInternship, applyToInternship } = require('../controllers/internship.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getInternships);
router.get('/:id', getInternshipById);
router.post('/', protect, authorize('admin', 'mentor'), createInternship);
router.post('/:id/apply', protect, applyToInternship);

module.exports = router;
