const express = require('express');
const router = express.Router();
const { getOpportunities } = require('../controllers/opportunity.controller');

// @route GET /api/opportunities
router.get('/', getOpportunities);

module.exports = router;
