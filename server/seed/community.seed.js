require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');
const Vote = require('../src/models/Vote');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-education-platform';

const users = [
  { name: 'Alice Mathews', email: 'alice@seed.com', password: 'Password123!', role: 'student' },
  { name: 'Bob Singh', email: 'bob@seed.com', password: 'Password123!', role: 'student' },
  { name: 'Carol Chen', email: 'carol@seed.com', password: 'Password123!', role: 'mentor' },
];

const postSeeds = [
  {
    title: 'How do I solve a system of linear equations?',
    description: 'I have been struggling with solving systems of linear equations using substitution and elimination. Can someone explain the best approach with an example involving 3 variables? I have tried elimination but always get confused with signs.',
    tags: ['math', 'linear-algebra', 'homework'],
  },
  {
    title: 'What is the difference between velocity and acceleration?',
    description: 'In physics class, my teacher keeps using velocity and acceleration interchangeably, but I know they are different. Can someone break down the conceptual difference clearly, especially in the context of circular motion?',
    tags: ['physics', 'mechanics', 'kinematics'],
  },
  {
    title: 'Best approach to learn recursion in Python?',
    description: 'I understand loops well but recursion completely breaks my brain. Every time I try to trace through a recursive function, I lose track. Is there a mental model or technique that helped you finally "get" recursion? Any beginner-friendly examples would be amazing.',
    tags: ['python', 'cs', 'recursion', 'beginner'],
  },
  {
    title: 'What is the difference between ionic and covalent bonds?',
    description: 'My chemistry exam is next week and I am confused about when a bond is ionic vs covalent. Is it purely based on electronegativity difference? What about polar covalent bonds — where do they fit in this spectrum?',
    tags: ['chemistry', 'bonding', 'exam-prep'],
  },
  {
    title: 'How does Newton\'s third law apply to rocket propulsion?',
    description: 'I understand the law says every action has an equal and opposite reaction, but when I try to explain rockets I always get confused about what the "reaction pair" actually is. Is the Earth pushing back on the rocket exhaust, or is the exhaust pushing back on the rocket?',
    tags: ['physics', 'rockets', 'newton'],
  },
  {
    title: 'How to solve quadratic inequalities on a number line?',
    description: 'I can solve quadratic equations no problem but when they become inequalities I always mess up which region to shade. Do we always need to factor? What if it does not factor nicely? My textbook explanation is not clicking for me.',
    tags: ['math', 'algebra', 'inequalities'],
  },
  {
    title: 'Explain Big-O notation in simple terms',
    description: 'Our algorithms course introduced Big-O notation this week and I feel completely lost. Why do we drop constants? Why does O(n^2) matter vs O(n)? A real-world analogy would help me understand why this is practically important at scale.',
    tags: ['cs', 'algorithms', 'big-o', 'beginner'],
  },
  {
    title: 'Balancing chemical equations — step by step?',
    description: 'I know the law of conservation of matter means atoms must be preserved, but the balancing process feels like guessing to me. Is there a systematic method? What do I do when there are polyatomic ions on both sides?',
    tags: ['chemistry', 'equations', 'homework'],
  },
  {
    title: 'What is integration by parts and when do you use it?',
    description: 'I have learned u-substitution and it makes sense for composite functions. But integration by parts feels like a completely different beast. The LIATE rule seems arbitrary to me — can someone explain the intuition behind it?',
    tags: ['math', 'calculus', 'integration'],
  },
  {
    title: 'How does binary search work and what is its complexity?',
    description: 'I implemented linear search fine, but binary search loses me after the mid-point split. Why does it only work on sorted arrays? How do you handle even-length arrays — do you take floor or ceiling for mid? Also what exactly makes it O(log n)?',
    tags: ['cs', 'algorithms', 'searching', 'data-structures'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing community data
    await Promise.all([
      User.deleteMany({ email: { $in: users.map((u) => u.email) } }),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Vote.deleteMany({}),
    ]);
    console.log('Cleared old seed data');

    // Create users
    const createdUsers = await Promise.all(
      users.map(async (u) => {
        const passwordHash = await bcrypt.hash(u.password, 10);
        return User.create({ name: u.name, email: u.email, password: passwordHash, role: u.role });
      })
    );
    console.log(`Created ${createdUsers.length} users`);

    // Create posts — distribute among users
    const createdPosts = await Promise.all(
      postSeeds.map((p, i) =>
        Post.create({ ...p, author: createdUsers[i % createdUsers.length]._id })
      )
    );
    console.log(`Created ${createdPosts.length} posts`);

    // Create comments — 15 total
    const commentData = [
      { postIdx: 0, userIdx: 1, content: 'Great question! For 3 variables, Gaussian elimination (row reduction) is the most reliable method. Write as an augmented matrix and row-reduce to echelon form.', parentIdx: null },
      { postIdx: 0, userIdx: 2, content: 'I second Gaussian elimination. Once you practice writing the augmented matrix it becomes very mechanical and error-free.', parentIdx: null },
      { postIdx: 0, userIdx: 0, content: 'Thanks! Does this work even when there are infinite solutions?', parentIdx: 0 }, // reply to comment[0]
      { postIdx: 1, userIdx: 0, content: 'Velocity is a vector (direction + magnitude), acceleration is the rate of change of velocity. In circular motion, speed can be constant but velocity changes direction, hence there IS acceleration (centripetal).', parentIdx: null },
      { postIdx: 1, userIdx: 2, content: 'Key insight: acceleration does NOT mean speeding up. Anything that changes the direction of velocity is also acceleration!', parentIdx: null },
      { postIdx: 2, userIdx: 1, content: 'Think of recursion as a function calling a smaller version of itself. The base case is where it stops. Trace the call stack on paper for factorial(3) — it really clicks after that.', parentIdx: null },
      { postIdx: 2, userIdx: 2, content: 'Fibonacci is another great beginner example. Draw the recursive tree and you will immediately see the repeated subproblems — this also motivates memoization!', parentIdx: null },
      { postIdx: 2, userIdx: 0, content: 'The call stack visualization was exactly what I needed, thank you!', parentIdx: 5 }, // reply
      { postIdx: 3, userIdx: 0, content: 'If electronegativity difference > 1.7, it is generally ionic. Below that is covalent (polar if 0.4–1.7, nonpolar if < 0.4). These are guidelines, not hard rules.', parentIdx: null },
      { postIdx: 4, userIdx: 1, content: 'The reaction pair is: rocket pushes exhaust backward, exhaust pushes rocket forward. Earth is not involved — rockets work in vacuum too, which is why space travel is possible!', parentIdx: null },
      { postIdx: 6, userIdx: 2, content: 'Think of it this way: if your algorithm takes 2n steps or 100n steps, both scale the same way relative to input size. Big-O cares about the growth rate, not the constant factor.', parentIdx: null },
      { postIdx: 6, userIdx: 0, content: 'Real-world analogy: finding a name in a phone book. Linear search = reading every name. Binary search = always opening to the middle and discarding half. With 1M entries, binary needs only ~20 steps!', parentIdx: null },
      { postIdx: 8, userIdx: 1, content: 'LIATE stands for Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. Choose u from earlier in the list. The point is to pick u so that du makes the integral simpler.', parentIdx: null },
      { postIdx: 9, userIdx: 2, content: 'Binary search requires sorted input because it relies on the sorted order to decide which half to discard. For mid, use Math.floor((low + high) / 2). It is O(log n) because each step halves the search space.', parentIdx: null },
      { postIdx: 9, userIdx: 0, content: 'One subtle bug: use mid = low + Math.floor((high - low) / 2) instead of (low + high) / 2 to avoid integer overflow in languages like Java/C++.', parentIdx: 13 }, // reply
    ];

    const createdComments = [];
    for (const c of commentData) {
      const comment = await Comment.create({
        author: createdUsers[c.userIdx]._id,
        postId: createdPosts[c.postIdx]._id,
        parentId: c.parentIdx !== null ? createdComments[c.parentIdx]._id : null,
        content: c.content,
      });
      createdComments.push(comment);
      // Update post commentCount
      await Post.findByIdAndUpdate(createdPosts[c.postIdx]._id, { $inc: { commentCount: 1 } });
    }
    console.log(`Created ${createdComments.length} comments`);

    // Create 20 votes
    const votePairs = [
      [0, 0, 'upvote'], [1, 0, 'upvote'], [2, 0, 'upvote'],
      [0, 1, 'upvote'], [1, 1, 'upvote'],
      [0, 2, 'upvote'], [2, 2, 'upvote'],
      [1, 3, 'upvote'], [2, 3, 'upvote'],
      [0, 4, 'upvote'], [1, 4, 'downvote'],
      [2, 5, 'upvote'], [0, 5, 'upvote'],
      [1, 6, 'upvote'], [2, 6, 'upvote'], [0, 6, 'upvote'],
      [0, 7, 'downvote'],
      [1, 8, 'upvote'], [2, 8, 'upvote'],
      [0, 9, 'upvote'],
    ]; // [userIdx, postIdx, type]

    for (const [uIdx, pIdx, type] of votePairs) {
      const userId = createdUsers[uIdx]._id;
      const postId = createdPosts[pIdx]._id;
      await Vote.create({ userId, postId, type });
      const inc = type === 'upvote' ? { upvotes: 1 } : { downvotes: 1 };
      await Post.findByIdAndUpdate(postId, { $inc: inc });
      const repChange = type === 'upvote' ? 10 : -2;
      await User.findByIdAndUpdate(createdPosts[pIdx].author, { $inc: { reputation: repChange } });
    }
    console.log('Created 20 votes');

    console.log('\n✅ Community seed complete!');
    console.log('Login credentials:');
    users.forEach((u) => console.log(`  ${u.email} / ${u.password}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
