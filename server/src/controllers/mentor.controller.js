const MentorProfile = require('../models/MentorProfile');

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public (or Private depending on route setup)
exports.getMentors = async (req, res) => {
  try {
    const { search, industry, availability, sort } = req.query;

    let query = {};

    // 1. Text Search (name, expertise)
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Filter by Industry
    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    // 3. Filter by Availability
    if (availability !== undefined) {
      // availability might be a string "true" or "false" from query
      query.availability = availability === 'true';
    }

    let mongooseQuery = MentorProfile.find(query).populate('user', 'name email avatar');

    // 4. Sort handling
    // Options: Most Experienced (experience desc), Top Rated (rating desc), Most Sessions (sessionCount desc)
    if (sort) {
      if (sort === 'Most Experienced') {
        mongooseQuery = mongooseQuery.sort({ experience: -1 });
      } else if (sort === 'Top Rated') {
        mongooseQuery = mongooseQuery.sort({ rating: -1 });
      } else if (sort === 'Most Sessions') {
        mongooseQuery = mongooseQuery.sort({ sessionCount: -1 });
      } else {
        mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
      }
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }

    const mentors = await mongooseQuery;

    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Error in getMentors:', error);
    res.status(500).json({ success: false, message: 'Server Error retrieving mentors' });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Public
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await MentorProfile.findById(req.params.id).populate('user', 'name email avatar');

    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Error in getMentorById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error retrieving mentor' });
  }
};
// @route   POST /api/mentors
// @access  Private
exports.createMentorProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debugging log

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userId = req.user._id;

    // Check if mentor profile already exists
    const existingProfile = await MentorProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Mentor profile already exists' });
    }

    const { name, bio, expertise, industry, experience, linkedIn } = req.body;

    const mentorProfile = await MentorProfile.create({
      user: userId,
      name: name || req.user.name,
      bio: bio || '',
      expertise: expertise || [],
      industry: industry || 'General',
      experience: experience || 0,
      linkedIn: linkedIn || ''
    });

    res.status(201).json({
      success: true,
      data: mentorProfile
    });
  } catch (error) {
    console.error('Error in createMentorProfile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mentor profile already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error creating mentor profile' });
  }
};
