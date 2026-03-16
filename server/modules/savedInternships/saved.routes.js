const express = require('express');
const router = express.Router();
const {
  saveInternship,
  getSavedInternships,
  unsaveInternship
} = require('./saved.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/save', protect, saveInternship);
router.get('/saved', protect, getSavedInternships);
router.delete('/saved/:id', protect, unsaveInternship);

module.exports = router;