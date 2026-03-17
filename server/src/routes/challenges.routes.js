const express = require('express');
const router = express.Router();
const c = require('../controllers/challengeController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', c.getChallenges);
router.get('/active', c.getActiveChallenge);
router.post('/:id/submit', protect, c.submitChallenge);

module.exports = router;
