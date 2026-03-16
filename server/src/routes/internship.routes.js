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
  deleteInternship,
  applyToInternship,
  getUserApplications,
  saveInternship,
  getSavedInternships,
  unsaveInternship,
  seedInternships
} = require('../controllers/internship.controller');
const { protect } = require('../middlewares/auth.middleware');

// Static routes first (before /:id)
router.get('/', getInternships);
router.get('/filter', filterInternships);
router.get('/recommended', protect, getRecommendedInternships);
router.get('/deadlines', getInternshipsByDeadlines);
router.get('/applications', protect, getUserApplications);
router.get('/saved', protect, getSavedInternships);

// Dynamic routes
router.get('/:id', getInternshipById);

// Mutation routes
router.post('/', protect, createInternship);
router.post('/apply', protect, applyToInternship);
router.post('/save', protect, saveInternship);
router.post('/seed', seedInternships);

router.put('/:id', protect, updateInternship);
router.delete('/:id', protect, deleteInternship);
router.delete('/saved/:id', protect, unsaveInternship);

module.exports = router;
