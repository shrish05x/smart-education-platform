const express = require('express');
const router = express.Router();
const c = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, c.getNotifications);
router.put('/read-all', protect, c.markAllRead);
router.put('/:id/read', protect, c.markOneRead);

module.exports = router;
