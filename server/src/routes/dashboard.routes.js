const express = require('express');
const router = express.Router();
const { getDashboard, getActivity, getProgress } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, getDashboard);
router.get('/activity', protect, getActivity);
router.get('/progress', protect, getProgress);

module.exports = router;
