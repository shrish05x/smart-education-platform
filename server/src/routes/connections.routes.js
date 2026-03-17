const express = require('express');
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  blockUser,
  removeConnection,
  getPendingRequests,
  getSentRequests,
  getMyNetwork,
  getSuggestions,
  getConnectionStatus
} = require('../controllers/connectionController');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/request', sendRequest);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/block', blockUser);
router.delete('/:id', removeConnection);

router.get('/requests', getPendingRequests);
router.get('/sent', getSentRequests);
router.get('/my-network', getMyNetwork);
router.get('/suggestions', getSuggestions);
router.get('/status/:userId', getConnectionStatus);

module.exports = router;
