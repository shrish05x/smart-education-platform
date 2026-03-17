const express = require('express');
const router = express.Router();
const c = require('../controllers/eventController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', c.getEvents);
router.post('/', protect, c.createEvent);
router.get('/:id', c.getEvent);
router.post('/:id/register', protect, c.registerForEvent);

module.exports = router;
