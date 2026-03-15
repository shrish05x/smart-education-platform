const User = require('../models/User');

// @desc    Get dashboard overview data
// @route   GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    // Mock dashboard data (in production, aggregate from real collections)
    const dashboard = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        profileImage: user.profileImage,
      },
      stats: {
        studyHoursThisWeek: 18.5,
        coursesEnrolled: 5,
        coursesCompleted: 2,
        streakDays: 12,
        mentorSessions: 3,
        communityPosts: 8,
      },
      upcomingSessions: [
        { _id: '1', title: 'Calculus II Tutoring', mentor: 'Dr. Sarah Chen', date: new Date(Date.now() + 86400000).toISOString(), type: 'mentoring', status: 'confirmed' },
        { _id: '2', title: 'Data Structures Study Group', mentor: 'Peer Group', date: new Date(Date.now() + 172800000).toISOString(), type: 'study-group', status: 'confirmed' },
        { _id: '3', title: 'Career Counseling Session', mentor: 'Prof. James Miller', date: new Date(Date.now() + 259200000).toISOString(), type: 'counseling', status: 'pending' },
      ],
      mentorMessages: [
        { _id: '1', from: 'Dr. Sarah Chen', avatar: 'SC', message: 'Great progress on your calculus assignments! Let\'s review integration techniques next session.', time: '2h ago', unread: true },
        { _id: '2', from: 'Prof. Raj Patel', avatar: 'RP', message: 'I\'ve shared some additional resources for your machine learning project.', time: '5h ago', unread: true },
        { _id: '3', from: 'Dr. Emily Brooks', avatar: 'EB', message: 'Your essay draft looks promising. Minor revisions needed.', time: '1d ago', unread: false },
      ],
      communityActivity: [
        { _id: '1', user: 'Alice Wang', action: 'posted in', target: 'CS201 Discussion', time: '30m ago', likes: 12 },
        { _id: '2', user: 'Marcus Johnson', action: 'answered in', target: 'Math Help Forum', time: '1h ago', likes: 8 },
        { _id: '3', user: 'Priya Sharma', action: 'created', target: 'Study Group: Physics', time: '2h ago', likes: 15 },
        { _id: '4', user: 'David Kim', action: 'shared resource in', target: 'Web Dev Community', time: '3h ago', likes: 22 },
      ],
      recommendedResources: [
        { _id: '1', title: 'Introduction to Algorithms', type: 'course', provider: 'MIT OpenCourseWare', rating: 4.8, difficulty: 'Intermediate' },
        { _id: '2', title: 'Machine Learning Specialization', type: 'course', provider: 'Stanford Online', rating: 4.9, difficulty: 'Advanced' },
        { _id: '3', title: 'Technical Writing Guide', type: 'article', provider: 'Google Developers', rating: 4.5, difficulty: 'Beginner' },
        { _id: '4', title: 'Data Visualization with Python', type: 'tutorial', provider: 'DataCamp', rating: 4.6, difficulty: 'Intermediate' },
      ],
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user activity feed
// @route   GET /api/dashboard/activity
const getActivity = async (req, res) => {
  try {
    const activity = [
      { _id: '1', type: 'study', title: 'Completed Chapter 5: Data Structures', description: 'Finished binary trees and heap implementations', time: '1h ago', icon: 'book' },
      { _id: '2', type: 'mentoring', title: 'Mentor Session with Dr. Sarah Chen', description: 'Reviewed calculus integration techniques', time: '3h ago', icon: 'users' },
      { _id: '3', type: 'community', title: 'Posted in CS201 Discussion', description: 'Shared solution approach for sorting algorithms', time: '5h ago', icon: 'message' },
      { _id: '4', type: 'achievement', title: 'Earned "Week Warrior" Badge', description: '7-day study streak achieved!', time: '1d ago', icon: 'award' },
      { _id: '5', type: 'study', title: 'Started Machine Learning Module', description: 'Beginning neural network fundamentals', time: '1d ago', icon: 'book' },
      { _id: '6', type: 'internship', title: 'Applied to Google SWE Internship', description: 'Application submitted successfully', time: '2d ago', icon: 'briefcase' },
      { _id: '7', type: 'counseling', title: 'Wellbeing Check-in Completed', description: 'Monthly mental health assessment', time: '3d ago', icon: 'heart' },
      { _id: '8', type: 'study', title: 'Completed Quiz: Database Systems', description: 'Scored 92% on normalization quiz', time: '3d ago', icon: 'book' },
    ];

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress / chart data
// @route   GET /api/dashboard/progress
const getProgress = async (req, res) => {
  try {
    const progress = {
      weeklyStudyHours: [
        { day: 'Mon', hours: 3.5 },
        { day: 'Tue', hours: 2.0 },
        { day: 'Wed', hours: 4.5 },
        { day: 'Thu', hours: 1.5 },
        { day: 'Fri', hours: 3.0 },
        { day: 'Sat', hours: 2.5 },
        { day: 'Sun', hours: 1.5 },
      ],
      courseCompletion: [
        { name: 'Data Structures', progress: 85, total: 100, color: '#6366f1' },
        { name: 'Calculus II', progress: 62, total: 100, color: '#8b5cf6' },
        { name: 'Machine Learning', progress: 30, total: 100, color: '#a855f7' },
        { name: 'Technical Writing', progress: 95, total: 100, color: '#10b981' },
        { name: 'Database Systems', progress: 48, total: 100, color: '#f59e0b' },
      ],
      overallProgress: 64,
      totalStudyHours: 142,
      averageScore: 87,
      completedAssignments: 34,
      totalAssignments: 42,
    };

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getActivity, getProgress };
