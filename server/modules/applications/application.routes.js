const express = require('express');
const router = express.Router();
const {
  applyToInternship,
  getUserApplications,
  getApplicationById
} = require('./application.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/apply', protect, applyToInternship);
router.get('/', protect, getUserApplications);
router.get('/:id', protect, getApplicationById);

module.exports = router;