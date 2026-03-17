require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const StudyGroup = require('../src/models/StudyGroup');

// Fake ObjectIds (24 hex chars) for mock members
const mockUserIds = [
  '6607a1f8e4b0f3a1b2c3d4e5',
  '6607a1f8e4b0f3a1b2c3d4e6',
  '6607a1f8e4b0f3a1b2c3d4e7',
  '6607a1f8e4b0f3a1b2c3d4e8',
  '6607a1f8e4b0f3a1b2c3d4e9',
  '6607a1f8e4b0f3a1b2c3d4ea',
  '6607a1f8e4b0f3a1b2c3d4eb',
  '6607a1f8e4b0f3a1b2c3d4ec',
  '6607a1f8e4b0f3a1b2c3d4ed',
  '6607a1f8e4b0f3a1b2c3d4ee',
  '6607a1f8e4b0f3a1b2c3d4ef',
  '6607a1f8e4b0f3a1b2c3d4f0',
];

const groups = [
  {
    name: 'Calculus Study Circle',
    subject: 'Mathematics',
    description: 'A group focused on mastering differentiation, integration, and real analysis for mid-term and final exams.',
    members: mockUserIds.slice(0, 8),
    memberCount: 8,
    tags: ['exam-prep', 'integration', 'weekly-meets'],
    maxMembers: 50,
    isPrivate: false,
    coverColor: '#5865f2',
    creator: mockUserIds[0],
    createdAt: new Date('2024-09-01'),
  },
  {
    name: 'Linear Algebra Prep Group',
    subject: 'Mathematics',
    description: 'Vectors, matrices, eigenvalues — let\'s crack them together! Weekly problem-solving sessions every Sunday.',
    members: mockUserIds.slice(2, 9),
    memberCount: 7,
    tags: ['matrices', 'exam-prep'],
    maxMembers: 30,
    isPrivate: false,
    coverColor: '#eb459e',
    creator: mockUserIds[2],
    createdAt: new Date('2024-09-10'),
  },
  {
    name: 'DSA Interview Bootcamp',
    subject: 'Computer Science',
    description: 'Daily LeetCode challenges, system design discussions, and mock interview rounds to crack FAANG interviews.',
    members: mockUserIds.slice(0, 12),
    memberCount: 12,
    tags: ['leetcode', 'interviews', 'daily-practice'],
    maxMembers: 50,
    isPrivate: false,
    coverColor: '#57f287',
    creator: mockUserIds[3],
    createdAt: new Date('2024-08-15'),
  },
  {
    name: 'Web Dev Cohort',
    subject: 'Computer Science',
    description: 'Building full-stack projects: React, Node.js, MongoDB. Share resources, review code, and grow together.',
    members: mockUserIds.slice(1, 10),
    memberCount: 9,
    tags: ['react', 'nodejs', 'fullstack', 'projects'],
    maxMembers: 40,
    isPrivate: false,
    coverColor: '#fee75c',
    creator: mockUserIds[1],
    createdAt: new Date('2024-08-20'),
  },
  {
    name: 'Quantum Mechanics Study Group',
    subject: 'Physics',
    description: 'Exploring wave functions, Schrödinger\'s equation, and quantum entanglement. A safe space for confused physics students.',
    members: mockUserIds.slice(3, 9),
    memberCount: 6,
    tags: ['quantum', 'wave-functions', 'advanced'],
    maxMembers: 25,
    isPrivate: false,
    coverColor: '#ed4245',
    creator: mockUserIds[4],
    createdAt: new Date('2024-09-05'),
  },
  {
    name: 'Organic Chemistry Lab Partners',
    subject: 'Chemistry',
    description: 'Share lab notes, reaction mechanisms, and help each other prepare for challenging organic chem exams.',
    members: mockUserIds.slice(5, 11),
    memberCount: 6,
    tags: ['lab-notes', 'reactions', 'organic'],
    maxMembers: 20,
    isPrivate: true,
    inviteCode: 'ORGCHEM',
    coverColor: '#3ba55c',
    creator: mockUserIds[5],
    createdAt: new Date('2024-09-08'),
  },
  {
    name: 'World History Discussion Club',
    subject: 'History',
    description: 'Discussing major historical events, civilizations, and their impact on the modern world. Essay help welcome!',
    members: mockUserIds.slice(0, 6),
    memberCount: 6,
    tags: ['essays', 'civilizations', 'discussion'],
    maxMembers: 35,
    isPrivate: false,
    coverColor: '#faa61a',
    creator: mockUserIds[6],
    createdAt: new Date('2024-09-12'),
  },
  {
    name: 'Macroeconomics Master Class',
    subject: 'Economics',
    description: 'GDP, inflation, monetary policy — understanding how global economies work. Case studies and exam prep included.',
    members: mockUserIds.slice(4, 10),
    memberCount: 6,
    tags: ['macro', 'case-studies', 'policy'],
    maxMembers: 40,
    isPrivate: false,
    coverColor: '#9b59b6',
    creator: mockUserIds[7],
    createdAt: new Date('2024-09-15'),
  },
];

const seedGroups = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-education-platform';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await StudyGroup.deleteMany({});
    console.log('Cleared existing study groups');

    await StudyGroup.insertMany(groups);
    console.log(`Inserted ${groups.length} study groups`);

    await mongoose.disconnect();
    console.log('Done! Disconnected from MongoDB');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedGroups();
