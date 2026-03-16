const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  filterInternships,
  getRecommendedInternships,
  getInternshipsByDeadlines,
  createInternship,
  updateInternship,
  deleteInternship
} = require('./internship.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/', getInternships);
router.get('/filter', filterInternships);
router.get('/recommended', protect, getRecommendedInternships);
router.get('/deadlines', getInternshipsByDeadlines);
router.get('/:id', getInternshipById);

router.post('/', protect, createInternship);
router.put('/:id', protect, updateInternship);
router.delete('/:id', protect, deleteInternship);

module.exports = router;