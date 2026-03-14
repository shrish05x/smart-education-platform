const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const createUser = async (userData) => {
  const user = await User.create(userData);
  return { user, token: generateToken(user._id) };
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

module.exports = { generateToken, createUser, findUserByEmail, findUserById };
