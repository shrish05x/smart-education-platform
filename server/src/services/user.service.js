const User = require('../models/User');

const getAllUsers = async (filter = {}) => {
  return await User.find(filter).select('-password');
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
