const Profile = require('../models/Profile');
const Contact = require('../models/Contact');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const UserInternship = require('../models/UserInternship');
const Achievement = require('../models/Achievement');
const Document = require('../models/Document');

// @desc    Get user profile data (all steps)
// @route   GET /api/profile/:userId
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      profile,
      contact,
      education,
      skill,
      projects,
      internships,
      achievement,
      document
    ] = await Promise.all([
      Profile.findOne({ user: userId }),
      Contact.findOne({ user: userId }),
      Education.findOne({ user: userId }),
      Skill.findOne({ user: userId }),
      Project.find({ user: userId }),
      UserInternship.find({ user: userId }),
      Achievement.findOne({ user: userId }),
      Document.findOne({ user: userId })
    ]);

    res.status(200).json({
      success: true,
      data: {
        profile: profile || {},
        contact: contact || {},
        education: education || {},
        skill: skill || {},
        projects: projects || [],
        internships: internships || [],
        achievement: achievement || {},
        document: document || {}
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile data' });
  }
};

// @desc    Update specific profile section
// @route   PUT /api/profile/update
// @access  Private
exports.updateProfileSection = async (req, res) => {
  try {
    const { userId, section, data } = req.body;

    if (!userId || !section || !data) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let updatedData;

    switch (section) {
      case 'profile':
        updatedData = await Profile.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      case 'contact':
        updatedData = await Contact.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      case 'education':
        updatedData = await Education.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      case 'skill':
        updatedData = await Skill.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      case 'projects':
        // For array models, we might replace all or handle individually. 
        // Here we assume the frontend sends the complete array of projects and we replace them.
        await Project.deleteMany({ user: userId });
        if (data.length > 0) {
          const projectsWithUser = data.map(p => ({ ...p, user: userId }));
          updatedData = await Project.insertMany(projectsWithUser);
        } else {
            updatedData = [];
        }
        break;
      case 'internships':
        await UserInternship.deleteMany({ user: userId });
        if (data.length > 0) {
          const internshipsWithUser = data.map(i => ({ ...i, user: userId }));
          updatedData = await UserInternship.insertMany(internshipsWithUser);
        } else {
            updatedData = [];
        }
        break;
      case 'achievement':
        updatedData = await Achievement.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      case 'document':
        updatedData = await Document.findOneAndUpdate(
          { user: userId },
          { ...data, user: userId },
          { new: true, upsert: true }
        );
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid section' });
    }

    res.status(200).json({
      success: true,
      data: updatedData
    });
  } catch (error) {
    console.error(`Error updating ${req.body.section} profile section:`, error);
    res.status(500).json({ success: false, message: 'Server error updating profile section' });
  }
};

// @desc    Calculate and get completion status
// @route   GET /api/profile/completion-status/:userId
// @access  Private
exports.getCompletionStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      profile,
      contact,
      education,
      skill,
      document
    ] = await Promise.all([
      Profile.findOne({ user: userId }),
      Contact.findOne({ user: userId }),
      Education.findOne({ user: userId }),
      Skill.findOne({ user: userId }),
      Document.findOne({ user: userId })
    ]);

    let filledSections = 0;
    const totalSectionsToCount = 5; // We count profile, contact, education, skill, docs as main required sections

    if (profile && profile.fullName && profile.dateOfBirth && profile.gender) filledSections++;
    if (contact && contact.phoneNumber && contact.currentAddress) filledSections++;
    if (education && education.courseBranch && education.collegeName) filledSections++;
    if (skill && skill.technicalSkills && skill.technicalSkills.length > 0) filledSections++;
    
    // docs might be required for the 90%+ green tick
    const hasRequiredDocs = !!(document && document.idProof && document.resume);
    if (hasRequiredDocs) filledSections++;

    const completionPercentage = Math.round((filledSections / totalSectionsToCount) * 100);
    const isVerified = completionPercentage >= 90 && hasRequiredDocs;

    res.status(200).json({
      success: true,
      data: {
        completionPercentage,
        isVerified,
        hasRequiredDocs
      }
    });

  } catch (error) {
    console.error('Error fetching completion status:', error);
    res.status(500).json({ success: false, message: 'Server error fetching completion status' });
  }
};
