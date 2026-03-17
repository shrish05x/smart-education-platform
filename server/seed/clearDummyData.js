require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');
const Vote = require('../src/models/Vote');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-education-platform';

const clearData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all community posts, comments, and votes
    const postsRes = await Post.deleteMany({});
    const commentsRes = await Comment.deleteMany({});
    const votesRes = await Vote.deleteMany({});

    console.log(`Deleted ${postsRes.deletedCount} posts`);
    console.log(`Deleted ${commentsRes.deletedCount} comments`);
    console.log(`Deleted ${votesRes.deletedCount} votes`);

    // We leave the Users alone so people can still log in, 
    // or optionally delete the 3 seed users if we want to be thorough.
    const dummyEmails = ['alice@seed.com', 'bob@seed.com', 'carol@seed.com'];
    const usersRes = await User.deleteMany({ email: { $in: dummyEmails } });
    console.log(`Deleted ${usersRes.deletedCount} dummy seed users`);

    console.log('Successfully cleared dummy data!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to clear data:', err);
    process.exit(1);
  }
};

clearData();
