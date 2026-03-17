require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // Keep path relative to where it runs or use path module ideally. Assuming running from server root with `node src/seed/...` this path is correct or needs adjusting based on runtime CWD. 

// Adjusting require paths to be absolutely correct relative to this file
// if this file is in server/src/seed/
const UserModel = require('../models/User');
const MentorProfileModel = require('../models/MentorProfile');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-education-platform';

const mentorsData = [
  {
    name: 'Sarah Chen',
    industry: 'Software Engineering',
    expertise: ['React', 'Node.js', 'System Design'],
    experience: 8,
    bio: 'Senior Staff Engineer focusing on scalable web architectures. Passionate about helping junior developers master full-stack javascript.',
    avatar: 'https://i.pravatar.cc/150?u=sarahchen',
    rating: 4.9,
    sessionCount: 145,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Marcus Johnson',
    industry: 'Software Engineering',
    expertise: ['Python', 'AI/ML', 'Data Structures'],
    experience: 5,
    bio: 'Machine Learning Engineer at a top tech firm. I can help you prepare for technical interviews and dive into AI.',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    rating: 4.8,
    sessionCount: 89,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Elena Rodriguez',
    industry: 'Software Engineering',
    expertise: ['Java', 'Spring Boot', 'Cloud Architecture'],
    experience: 12,
    bio: 'Backend specialist with over a decade of experience building enterprise systems in Java. Happy to review architecture designs.',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    rating: 5.0,
    sessionCount: 234,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'David Kim',
    industry: 'Product Management',
    expertise: ['Agile', 'Product Strategy', 'User Interviews'],
    experience: 7,
    bio: 'Transitioned from engineering to product. I help people navigate the PM interview loop and master product roadmapping.',
    avatar: 'https://i.pravatar.cc/150?u=davidk',
    rating: 4.7,
    sessionCount: 62,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Priya Patel',
    industry: 'Product Management',
    expertise: ['B2B SaaS', 'Analytics', 'Growth'],
    experience: 9,
    bio: 'VP of Product at a fast-growing SaaS startup. Let\'s talk about growth metrics and scaling products.',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    rating: 4.9,
    sessionCount: 112,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Alex Rivera',
    industry: 'UX/UI Design',
    expertise: ['Figma', 'User Research', 'Interaction Design'],
    experience: 6,
    bio: 'Product Designer obsessed with accessibility and beautiful interactions. I can review your portfolio and give actionable feedback.',
    avatar: 'https://i.pravatar.cc/150?u=alexr',
    rating: 4.8,
    sessionCount: 78,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Jordan Lee',
    industry: 'UX/UI Design',
    expertise: ['Design Systems', 'Prototyping', 'CSS'],
    experience: 10,
    bio: 'Lead Designer specializing in massive design systems. Creating cohesive digital experiences is my passion.',
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    rating: 4.9,
    sessionCount: 180,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Wei Zhang',
    industry: 'Data Science',
    expertise: ['SQL', 'Pandas', 'Predictive Modeling'],
    experience: 4,
    bio: 'Data Scientist turning messy data into business insights. I mentor on data analysis setups and Python tooling.',
    avatar: 'https://i.pravatar.cc/150?u=wei',
    rating: 4.6,
    sessionCount: 45,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Samantha Wright',
    industry: 'Finance',
    expertise: ['Financial Modeling', 'Venture Capital', 'Startup Funding'],
    experience: 15,
    bio: 'Former VC partner now advising early-stage startups. I can help you understand deal structures and financial models.',
    avatar: 'https://i.pravatar.cc/150?u=samantha',
    rating: 5.0,
    sessionCount: 320,
    linkedIn: 'https://linkedin.com/in/mock'
  },
  {
    name: 'Omar Hassan',
    industry: 'Marketing',
    expertise: ['SEO', 'Content Strategy', 'Brand Positioning'],
    experience: 8,
    bio: 'Digital marketing strategist. Let\'s work on your go-to-market strategy or personal branding.',
    avatar: 'https://i.pravatar.cc/150?u=omar',
    rating: 4.7,
    sessionCount: 95,
    linkedIn: 'https://linkedin.com/in/mock'
  }
];

const seedMentors = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding');

    // Clear existing mentor profiles and drop old collection to clear conflicting indexes
    try {
      await MentorProfileModel.collection.drop();
      console.log('Dropped existing mentor profiles collection');
    } catch (e) {
      if (e.code === 26) {
        console.log('Mentor collection does not exist yet, skipping drop.');
      } else {
        console.error('Error dropping collection:', e);
      }
    }

    // We need generic users for these mentors to attach to.
    // Let's create dummy users for them if they don't exist.
    // If a dummy user already exists based on email, we use it.
    
    for (let mData of mentorsData) {
      const dummyEmail = `${mData.name.toLowerCase().replace(' ', '.')}@mentor.mock`;
      let user = await UserModel.findOne({ email: dummyEmail });
      
      if (!user) {
        user = await UserModel.create({
          name: mData.name,
          email: dummyEmail,
          password: 'password123', // Dummy password
          role: 'mentor'
        });
      }
      
      // Create Mentor Profile
      await MentorProfileModel.create({
        ...mData,
        userId: user._id
      });
    }

    console.log('Successfully seeded 10 mentor profiles!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMentors();
