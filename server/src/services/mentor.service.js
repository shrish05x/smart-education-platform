const MentorProfile = require('../models/MentorProfile');

const getAllMentors = async () => {
  return await MentorProfile.find().populate('user', 'name email avatar');
};

const getMentorById = async (id) => {
  return await MentorProfile.findById(id).populate('user', 'name email avatar');
};

const getMentorByUserId = async (userId) => {
  return await MentorProfile.findOne({ user: userId }).populate('user', 'name email avatar');
};

const createOrUpdateProfile = async (userId, data) => {
  let profile = await MentorProfile.findOne({ user: userId });
  if (profile) {
    Object.assign(profile, data);
    await profile.save();
  } else {
    profile = await MentorProfile.create({ ...data, user: userId });
  }
  return profile;
};

module.exports = { getAllMentors, getMentorById, getMentorByUserId, createOrUpdateProfile };
