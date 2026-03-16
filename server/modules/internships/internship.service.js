const Internship = require('./internship.model');
const User = require('../../models/User');

// Service for internship recommendations
const getRecommendedInternships = async (userId) => {
  const user = await User.findById(userId).populate('studentProfile');
  if (!user || !user.studentProfile || !user.studentProfile.interests) {
    return [];
  }

  const userInterests = user.studentProfile.interests;
  const internships = await Internship.find({
    skillsRequired: { $in: userInterests }
  })
    .populate('companyId', 'name logo location')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  return internships;
};

// Service for skill gap analysis
const analyzeSkillGap = async (userId) => {
  const user = await User.findById(userId).populate('studentProfile');
  if (!user || !user.studentProfile || !user.studentProfile.interests) {
    return { gaps: [], matches: [] };
  }

  const userSkills = user.studentProfile.interests;
  const allInternships = await Internship.find();

  const requiredSkills = new Set();
  allInternships.forEach(internship => {
    internship.skillsRequired.forEach(skill => requiredSkills.add(skill));
  });

  const gaps = Array.from(requiredSkills).filter(skill => !userSkills.includes(skill));
  const matches = userSkills.filter(skill => requiredSkills.has(skill));

  return { gaps, matches };
};

module.exports = {
  getRecommendedInternships,
  analyzeSkillGap
};