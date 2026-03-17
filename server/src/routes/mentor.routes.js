const express = require('express');
const { getMentors, getMentorById } = require('../controllers/mentor.controller');

const router = express.Router();

router.route('/')
  .get(getMentors);

router.route('/:id')
  .get(getMentorById);

module.exports = router;
