const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deactivateUser, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
