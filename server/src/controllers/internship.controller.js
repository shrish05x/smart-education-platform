const Internship = require('../models/Internship');
const Company = require('../models/Company');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const SavedInternship = require('../models/SavedInternship');

// @desc    Get all internships
const getInternships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const query = {};
    if (req.query.skills) {
      query.skillsRequired = { $in: req.query.skills.split(',').map(s => s.trim()) };
    }
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.search) {
      query.$or = [
        { role: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const internships = await Internship.find(query)
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments(query);

    res.json({
      internships,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internship by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('companyId')
      .populate('postedBy', 'name email');

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Increment views
    internship.views += 1;
    await internship.save();

    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Filter internships
const filterInternships = async (req, res) => {
  try {
    const { skills, location, stipend, duration, type } = req.query;
    let query = {};

    if (skills) {
      query.skillsRequired = { $in: skills.split(',') };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (stipend) {
      query.stipend = { $gte: parseInt(stipend) };
    }
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const internships = await Internship.find(query)
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended internships
const getRecommendedInternships = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile || !studentProfile.interests || studentProfile.interests.length === 0) {
      return res.status(400).json({ message: 'User interests not found' });
    }

    const userInterests = studentProfile.interests;
    const internships = await Internship.find({
      skillsRequired: { $in: userInterests }
    })
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internships with deadlines soon
const getInternshipsByDeadlines = async (req, res) => {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const internships = await Internship.find({
      deadline: { $gte: now, $lte: soon }
    })
      .populate('companyId', 'name logo location')
      .populate('postedBy', 'name')
      .sort({ deadline: 1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create internship
const createInternship = async (req, res) => {
  try {
    const { company, companyId, role, description, requirements, skillsRequired, location, stipend, duration, type, deadline } = req.body;

    const internship = new Internship({
      company: company || 'Unknown Company',
      companyId,
      role,
      description,
      requirements,
      skillsRequired,
      location,
      stipend,
      duration,
      type,
      deadline,
      postedBy: req.user._id
    });

    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update internship
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    if (internship.postedBy && internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInternship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete internship
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    if (internship.postedBy && internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to internship
const applyToInternship = async (req, res) => {
  try {
    const { internshipId, resumeURL } = req.body;
    const userId = req.user._id;

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, internshipId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this internship' });
    }

    const application = new Application({
      userId,
      internshipId,
      resumeURL
    });

    await application.save();

    // Increment applicants count
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicantsCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save internship
const saveInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;
    const userId = req.user._id;

    // Check if already saved
    const existing = await SavedInternship.findOne({ userId, internshipId });
    if (existing) {
      return res.status(400).json({ message: 'Internship already saved' });
    }

    const saved = new SavedInternship({
      userId,
      internshipId
    });

    await saved.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved internships
const getSavedInternships = async (req, res) => {
  try {
    const saved = await SavedInternship.find({ userId: req.user._id })
      .populate('internshipId')
      .sort({ savedAt: -1 });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave internship
const unsaveInternship = async (req, res) => {
  try {
    const saved = await SavedInternship.findById(req.params.id);
    if (!saved) return res.status(404).json({ message: 'Saved internship not found' });

    if (saved.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SavedInternship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed demo internships
const seedInternships = async (req, res) => {
  try {
    const demoInternships = [
      {
        company: 'Google',
        role: 'Software Engineering Intern',
        description: 'Join Google\'s engineering team to work on cutting-edge products used by billions. You\'ll collaborate with experienced engineers on real projects, participate in code reviews, and contribute to production systems.',
        requirements: ['Currently pursuing B.Tech/M.Tech in CS or related field', 'Strong foundations in data structures and algorithms', 'Experience with at least one programming language (Python, Java, C++)', 'Good problem-solving skills'],
        skillsRequired: ['Python', 'Java', 'Data Structures', 'Algorithms', 'System Design'],
        location: 'Bangalore',
        stipend: 80000,
        duration: '3 months',
        type: 'hybrid',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        company: 'Microsoft',
        role: 'Frontend Developer Intern',
        description: 'Build modern web experiences for Microsoft 365 products. Work with React, TypeScript, and Fluent UI to create accessible, performant interfaces used by millions of enterprise customers worldwide.',
        requirements: ['Pursuing degree in Computer Science or related field', 'Strong knowledge of HTML, CSS, JavaScript', 'Familiarity with React or similar frameworks', 'Understanding of responsive design principles'],
        skillsRequired: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        location: 'Hyderabad',
        stipend: 75000,
        duration: '6 months',
        type: 'onsite',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      },
      {
        company: 'Amazon',
        role: 'Data Science Intern',
        description: 'Apply machine learning and statistical analysis to solve real-world problems at Amazon scale. You\'ll work with massive datasets, build predictive models, and directly impact customer experience and business outcomes.',
        requirements: ['Strong background in statistics and mathematics', 'Experience with Python and data science libraries', 'Knowledge of machine learning algorithms', 'Ability to communicate findings effectively'],
        skillsRequired: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
        location: 'Remote',
        stipend: 70000,
        duration: '3 months',
        type: 'remote',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        company: 'Flipkart',
        role: 'Backend Developer Intern',
        description: 'Work on microservices powering India\'s largest e-commerce platform. Design and implement scalable APIs, optimize database queries, and ensure high availability during major sale events.',
        requirements: ['Knowledge of Node.js or Java/Spring Boot', 'Understanding of RESTful API design', 'Familiarity with databases (SQL/NoSQL)', 'Basic understanding of cloud services'],
        skillsRequired: ['Node.js', 'MongoDB', 'REST API', 'Docker', 'Express.js'],
        location: 'Bangalore',
        stipend: 50000,
        duration: '4 months',
        type: 'onsite',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      },
      {
        company: 'Razorpay',
        role: 'Full Stack Developer Intern',
        description: 'Build end-to-end features for India\'s leading payment gateway. Work across the stack from React frontends to Go/Node.js backends, handling payment flows serving millions of transactions.',
        requirements: ['Proficiency in JavaScript/TypeScript', 'Experience with React and Node.js', 'Understanding of payment systems (bonus)', 'Good debugging and problem-solving skills'],
        skillsRequired: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git'],
        location: 'Bangalore',
        stipend: 60000,
        duration: '6 months',
        type: 'hybrid',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
      },
      {
        company: 'Zomato',
        role: 'UI/UX Design Intern',
        description: 'Design delightful food ordering experiences for millions of users. Create wireframes, prototypes, and high-fidelity designs while collaborating closely with product managers and engineers.',
        requirements: ['Portfolio demonstrating UI/UX design skills', 'Proficiency in Figma or Adobe XD', 'Understanding of design systems', 'Knowledge of user research methods'],
        skillsRequired: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
        location: 'Delhi',
        stipend: 40000,
        duration: '3 months',
        type: 'hybrid',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      }
    ];

    await Internship.deleteMany({});
    const created = await Internship.insertMany(demoInternships);
    res.status(201).json({ message: `Seeded ${created.length} internships`, internships: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  filterInternships,
  getRecommendedInternships,
  getInternshipsByDeadlines,
  createInternship,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getUserApplications,
  saveInternship,
  getSavedInternships,
  unsaveInternship,
  seedInternships
};
