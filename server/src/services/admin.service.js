const User = require('../models/User');

const getAllUsers = async () => {
  return await User.find().select('-password');
};

const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
};

const deactivateUser = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
};

const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

module.exports = { getAllUsers, updateUserRole, deactivateUser, deleteUser };
