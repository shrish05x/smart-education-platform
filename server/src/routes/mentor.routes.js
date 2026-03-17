const express = require('express');
const { getMentors, getMentorById, createMentorProfile } = require('../controllers/mentor.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getMentors)
  .post(protect, createMentorProfile);

router.route('/:id')
  .get(getMentorById);

module.exports = router;
