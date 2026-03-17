const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  getGroups,
  createGroup,
  getGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  getMessages,
  postMessage,
  shareResource,
  getResources,
} = require('../controllers/groupController');

// All routes are protected
router.use(protect);

// Group CRUD
router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroup);
router.delete('/:id', deleteGroup);

// Membership
router.post('/join', joinGroup);
router.post('/:id/leave', leaveGroup);

// Messages
router.get('/:id/messages', getMessages);
router.post('/:id/messages', postMessage);

// Resources
router.get('/:id/resources', getResources);
router.post('/:id/resources', shareResource);

module.exports = router;
