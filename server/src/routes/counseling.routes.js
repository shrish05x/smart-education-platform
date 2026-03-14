const express = require('express');
const router = express.Router();
const { createSession, getSessions, updateSession } = require('../controllers/counseling.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, createSession);
router.get('/', protect, getSessions);
router.put('/:id', protect, updateSession);

module.exports = router;
