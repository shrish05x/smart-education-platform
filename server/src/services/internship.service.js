const Internship = require('../models/Internship');

const getAllInternships = async () => {
  return await Internship.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 });
};

const getInternshipById = async (id) => {
  return await Internship.findById(id).populate('postedBy', 'name');
};

const createInternship = async (data) => {
  return await Internship.create(data);
};

const applyToInternship = async (internshipId, userId) => {
  const internship = await Internship.findById(internshipId);
  if (!internship) throw new Error('Internship not found');
  if (internship.applicants.includes(userId)) throw new Error('Already applied');
  internship.applicants.push(userId);
  await internship.save();
  return internship;
};

module.exports = { getAllInternships, getInternshipById, createInternship, applyToInternship };
