const express = require('express');
const { createRequest, getSessions } = require('../controllers/mentorship.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All mentorship routes require authentication
router.use(protect);

router.route('/request')
  .post(createRequest);

router.route('/sessions')
  .get(getSessions);

module.exports = router;
