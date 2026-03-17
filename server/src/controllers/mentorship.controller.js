const MentorshipSession = require('../models/MentorshipSession');
const MentorProfile = require('../models/MentorProfile');

// @desc    Submit a mentorship request
// @route   POST /api/mentorship/request
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    const { mentorId, date, duration, goals } = req.body;
    const studentId = req.user.id; // requires authentication middleware

    // 1. Basic validation
    if (!mentorId || !date) {
      return res.status(400).json({ success: false, message: 'Please provide mentor and date' });
    }

    // 2. Validate Date (must be in future, e.g. at least 24h ahead conceptually, but standard check is > now)
    const requestDate = new Date(date);
    const now = new Date();
    
    // Check if date is at least 24 hours in the future
    const hours24 = 24 * 60 * 60 * 1000;
    if (requestDate.getTime() <= now.getTime() + hours24) {
      return res.status(400).json({ success: false, message: 'Requested date must be at least 24 hours in the future' });
    }

    // 3. Validate Mentor exists and is available
    const mentor = await MentorProfile.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    if (!mentor.availability) {
      return res.status(409).json({ success: false, message: 'Mentor is not currently accepting students' });
    }

    // 4. Check for duplicate pending request for this student to this mentor
    const existingRequest = await MentorshipSession.findOne({
      studentId: studentId,
      mentorId: mentorId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(409).json({ success: false, message: 'You already have a pending request with this mentor' });
    }

    // 5. Create the session
    const session = await MentorshipSession.create({
      studentId,
      mentorId,
      date: requestDate,
      duration: duration || 60,
      requestMessage: goals || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error in createRequest:', error);
    res.status(500).json({ success: false, message: 'Server Error submitting request' });
  }
};

// @desc    Fetch all mentorship sessions for a user
// @route   GET /api/mentorship/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    // A user might be a student or a mentor. Let's fetch sessions where they are either.
    // For this module, let's assume current user is the student viewing their dashboard.
    // But to be thorough, check if this user has a mentor profile.
    const mentorProfile = await MentorProfile.findOne({ userId: userId });

    let query = { studentId: userId };

    if (mentorProfile) {
      // User is also a mentor, fetch sessions where they are the mentor or the student
      query = {
        $or: [
          { studentId: userId },
          { mentorId: mentorProfile._id }
        ]
      };
    }

    const sessions = await MentorshipSession.find(query)
      .populate('mentorId', 'name avatar industry expertise')
      .populate('studentId', 'name email avatar')
      .sort({ date: 1 }); // sort upcoming first

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });

  } catch (error) {
    console.error('Error in getSessions:', error);
    res.status(500).json({ success: false, message: 'Server Error retrieving sessions' });
  }
};
