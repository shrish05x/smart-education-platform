require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');
const Event = require('../src/models/Event');
const WeeklyChallenge = require('../src/models/WeeklyChallenge');
const Connection = require('../src/models/Connection');

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({ email: { $regex: /@seed\.com$/ } }),
      Post.deleteMany({}),
      Comment.deleteMany({ __v: 0 }),
      Event.deleteMany({}),
      WeeklyChallenge.deleteMany({}),
      Connection.deleteMany({}),
    ]);
    console.log('🗑️  Cleared old seed data');

    // ─── USERS ──────────────────────────────────────────
    const userData = [
      { name: 'Arjun Sharma',   email: 'arjun@seed.com',   skills: ['DSA', 'Java', 'System Design'], goals: 'Placement 2026 at top product company', lookingFor: ['study partner', 'mock interviews'], points: 1240, reputation: 1240 },
      { name: 'Priya Patel',    email: 'priya@seed.com',   skills: ['Python', 'ML', 'AI'],            goals: 'Research internship at IIT', lookingFor: ['project teammate', 'research'], points: 680, reputation: 680 },
      { name: 'Rahul Gupta',    email: 'rahul@seed.com',   skills: ['Web Dev', 'React', 'Node'],      goals: 'FAANG preparation 2026', lookingFor: ['project teammate', 'mock interviews'], points: 340, reputation: 340 },
      { name: 'Sneha Iyer',     email: 'sneha@seed.com',   skills: ['DBMS', 'SQL', 'OS'],             goals: 'Data Engineering role', lookingFor: ['study partner', 'mentorship'], isOpenToConnect: true, points: 120, reputation: 120 },
      { name: 'Vikram Singh',   email: 'vikram@seed.com',  skills: ['C++', 'DSA', 'CN'],              goals: 'Campus placement 2025', lookingFor: ['study partner'], isOpenToConnect: false, points: 55, reputation: 55 },
    ];

    const badges = {
      1240: [{ name: 'Expert', icon: '🏆', awardedAt: new Date() }, { name: 'Helper', icon: '🤝', awardedAt: new Date() }],
      680:  [{ name: 'Helper', icon: '🤝', awardedAt: new Date() }, { name: 'Contributor', icon: '⭐', awardedAt: new Date() }],
      340:  [{ name: 'Contributor', icon: '⭐', awardedAt: new Date() }],
      120:  [{ name: 'Beginner', icon: '🌱', awardedAt: new Date() }],
      55:   [{ name: 'Beginner', icon: '🌱', awardedAt: new Date() }],
    };

    const users = await Promise.all(userData.map(async (u) => {
      const password = await bcrypt.hash('Password123!', 10);
      return User.create({ ...u, password, badges: badges[u.points] || [], role: 'student' });
    }));
    console.log(`✅ Created ${users.length} users`);

    const [arjun, priya, rahul, sneha, vikram] = users;

    // ─── POSTS ──────────────────────────────────────────
    const postData = [
      { author: arjun._id,  type: 'question',    subject: 'DSA',     title: 'How does Dijkstra\'s algorithm handle negative weights?', description: 'I understand that Dijkstra\'s algorithm fails with negative edge weights, but I\'m not entirely sure WHY. Can someone explain the fundamental reason — is it because of the greedy assumption? And what\'s the correct alternative to use when negative weights are present? I tried to trace through a small example but get confused at the relaxation step.', tags: ['dsa', 'graph', 'algorithms'] },
      { author: priya._id,  type: 'discussion',  subject: 'AI',      title: 'Is transformer architecture still the best for NLP in 2025?', description: 'With SSMs (State Space Models like Mamba) being proposed as more efficient alternatives to transformers, I\'m wondering if the community still believes transformers are the go-to for NLP. What are the current tradeoffs — transformer vs Mamba vs hybrid architectures? Looking for a nuanced discussion, not just "transformers are fine" or "SSMs will replace them".', tags: ['ai', 'ml', 'nlp'] },
      { author: rahul._id,  type: 'resource',    subject: 'Web Dev',  title: '📚 Complete React 19 + Next.js 15 Interview Prep Notes', description: 'After spending 3 months preparing for product-based company interviews, I\'ve compiled all my React and Next.js notes covering: React hooks in depth (useTransition, useDeferredValue, use()), Server Components vs Client Components mental model, App Router patterns, hydration, streaming SSR, and 50+ common interview questions with answers. PDF and Notion link included. Hope this helps 2026 batch!', tags: ['react', 'web-dev', 'interview-prep'], attachments: [{ type: 'link', url: 'https://example.com/react-notes', name: 'React 19 Interview Notes' }], averageRating: 4.2 },
      { author: arjun._id,  type: 'achievement', subject: 'DSA',     title: '🏆 Cracked Google L4 SWE offer! Here\'s my 6-month roadmap', description: 'After 6 months of intense preparation and 4 failed attempts at top companies, I finally received a Google L4 Software Engineer offer!\n\nKey things that actually worked:\n- 300+ LeetCode problems (quality over quantity)\n- Mock interviews with peers every week\n- System design from scratch — not just memorizing patterns\n- Behavioral prep using STAR method\n\nHappy to answer any questions on the journey!', tags: ['dsa', 'interview-prep', 'system-design'] },
      { author: vikram._id, type: 'question',    subject: 'OS',      title: 'What exactly happens during a context switch in the OS?', description: 'My professor briefly mentioned context switching in the OS course, but I still feel fuzzy on the exact sequence of events. What data is saved and where? What\'s the difference between a context switch triggered by a timer interrupt vs a voluntary yield? Does context switching happen between threads too or only between processes?', tags: ['os', 'processes', 'kernel'] },
      { author: sneha._id,  type: 'question',    subject: 'DBMS',    title: 'When exactly should I use a composite index vs separate indexes?', description: 'I know that composite indexes cover multiple columns, but I\'m not sure how the query optimizer uses them. If I have a query like WHERE status = \'active\' AND created_at > \'2024-01-01\', should I create a composite (status, created_at) index or separate indexes on each column? What is the "index selectivity" rule that people keep mentioning?', tags: ['dbms', 'sql', 'indexing'] },
      { author: priya._id,  type: 'resource',    subject: 'ML',      title: '📊 Machine Learning A-Z: My curated list of papers + code', description: 'For anyone preparing for ML/AI roles or research internships, here\'s my curated reading list organized by topic:\n\n1. Fundamentals: Bishop\'s PRML + fast.ai course\n2. Deep Learning: deep learning book + Karpathy YouTube\n3. Transformers: Attention is All You Need → BERT → GPT series\n4. Practical: Papers with Code + Hugging Face tutorials\n\nFor each I\'ve noted estimated completion time and difficulty.', tags: ['ml', 'ai', 'python'], averageRating: 4.7 },
      { author: rahul._id,  type: 'discussion',  subject: 'Web Dev',  title: 'REST vs GraphQL vs tRPC — which should we use for a student project?', description: 'We\'re a team of 4 building a full-stack web app for our final year project. The backend will be Node.js. Our advisor suggested REST, our team lead wants GraphQL, and I\'ve been reading about tRPC which sounds interesting for TypeScript projects. What are the real practical differences for a team with ~2 devs with backend experience? Performance, DX, learning curve — anything goes.', tags: ['web-dev', 'node', 'interview-prep'] },
      { author: sneha._id,  type: 'question',    subject: 'CN',      title: 'How does TCP ensure reliable delivery without the receiver acknowledging every single packet?', description: 'I\'m studying for my CN exam and trying to understand TCP. I get that ACKs are sent, but I\'ve read that TCP uses cumulative ACKs and sliding window. How does sliding window work in practice? If packet 5 is lost but packets 6,7,8 arrive, what happens exactly — does the receiver buffer those or discard them? What\'s the difference between Go-Back-N and Selective Repeat in TCP\'s implementation?', tags: ['cn', 'tcp', 'networking'] },
      { author: arjun._id,  type: 'challenge',   subject: 'DSA',     title: '🎯 Weekly Challenge: Implement LRU Cache from scratch', description: 'This week\'s DSA challenge:\n\nImplement an LRU (Least Recently Used) Cache with:\n- get(key): O(1) time complexity\n- put(key, value): O(1) time complexity\n- Automatically evicts least recently used item when capacity is exceeded\n\nHint: Think about which data structures give you O(1) for both lookup and order tracking.\n\nPost your solution in the comments!', tags: ['dsa', 'interview-prep'] },
      { author: vikram._id, type: 'question',    subject: 'DSA',     title: 'Dynamic programming tabulation vs memoization — when to use which?', description: 'I can solve most DP problems using top-down memoization (recursion + cache), and I understand the bottom-up tabulation approach conceptually. But when does it actually matter which one I use? Are there cases where one is significantly more efficient in terms of space or time? My interviewer said "prefer tabulation in production code" — why?', tags: ['dsa', 'algorithms'] },
      { author: priya._id,  type: 'discussion',  subject: 'AI',      title: 'Should CS students learn Rust in 2025? Is it actually worth the steep learning curve?', description: 'I see Rust mentioned everywhere — systems programming, WebAssembly, even ML infrastructure. But the learning curve is notoriously steep (borrow checker, ownership model). As a CS student primarily focused on software roles and some ML work, is learning Rust actually worth the investment of 2-3 months? Or is that time better spent deepening Python/C++ skills?', tags: ['c++', 'python', 'system-design'] },
      { author: rahul._id,  type: 'resource',    subject: 'Web Dev',  title: '🔐 Full-stack auth in 2025: JWT vs sessions vs OAuth 2.0 explained', description: 'Authentication is one of the most confusing topics for web devs. After implementing auth in 5 different projects, here\'s everything I wish I\'d known:\n\n- JWT: stateless, scalable, but hard to invalidate — suitable for APIs\n- Sessions: stateful, easy to invalidate, but need sticky sessions at scale\n- OAuth 2.0: for third-party login (Google, GitHub) — always use a library\n- Refresh token rotation: the right way to stay logged in\n\nIncludes code examples for Node.js + React.', tags: ['web-dev', 'node', 'react'] },
      { author: sneha._id,  type: 'achievement', subject: 'DBMS',    title: '🌟 Got selected for Google Summer of Code 2025!', description: 'I\'m thrilled to share that I\'ve been selected for GSoC 2025 with the PostgreSQL Foundation! I\'ll be working on query plan visualizations for pg_query.\n\nThis is my third application — first two were rejected. What finally worked:\n1. Contributing small PRs to the org before proposals\n2. A very detailed implementation plan in the proposal\n3. Having real domain knowledge in DBMS/query optimizers\n\nHappy to do a future post on "How to actually get into GSoC" if there\'s interest!', tags: ['dbms', 'sql', 'interview-prep'] },
      { author: arjun._id,  type: 'question',    subject: 'System Design', title: 'How to design a rate limiter at the API gateway level?', description: 'For a system design interview question, I was asked to "design a rate limiter that works across multiple backend services behind an API gateway." I\'m stuck on a few things:\n1. Where does the state (counter per user) live — Redis? Local per-server? Hybrid?\n2. How do you handle race conditions in distributed counting?\n3. What algorithms exist (token bucket vs leaky bucket vs sliding window)?\n4. How do you avoid losing legitimate requests during traffic spikes?', tags: ['system-design', 'interview-prep'] },
    ];

    const posts = await Promise.all(postData.map((p) =>
      Post.create({ ...p, upvotes: Math.floor(Math.random() * 20), views: Math.floor(Math.random() * 200) + 10 })
    ));
    console.log(`✅ Created ${posts.length} posts`);

    // ─── COMMENTS ────────────────────────────────────────
    const commentData = [
      { author: priya._id, postIdx: 0, content: 'Great question! The core reason is the greedy assumption: Dijkstra assumes that once a node is finalized (popped from the priority queue), its shortest path is found. With negative edges, a later path could be shorter via a negative edge even after finalization — breaking the invariant. Use Bellman-Ford (O(VE)) for negative weights. If no negative-weight cycles, Bellman-Ford guarantees correct answers.' },
      { author: arjun._id, postIdx: 0, content: 'To add to Priya\'s answer — Johnson\'s Algorithm is the best choice if you need all-pairs shortest paths with negative edges. It works by reweighting edges using Bellman-Ford, then running Dijkstra from each vertex on the reweighted graph. O(V² log V + VE) total.', parentIdx: null },
      { author: rahul._id, postIdx: 0, content: 'A tip: for interview purposes, if the interviewer asks "what about negative edges?", the safe answer is always Bellman-Ford for SSSP and Floyd-Warshall for APSP.', parentIdx: null },
      { author: arjun._id, postIdx: 1, content: 'Transformers are still dominant because of their parallelizability during training. Mamba and other SSMs are more efficient at inference time for very long sequences (linear scaling vs quadratic attention), but training at scale still heavily favors transformers. I\'d say watch the space — but don\'t abandon transformer knowledge for job prep.', parentIdx: null },
      { author: sneha._id, postIdx: 1, content: 'The research I\'ve seen from 2024-2025 suggests hybrid architectures (transformer + SSM layers) are winning in practice. Neither pure model type "won". For practical purposes in 2025, knowing transformers deeply is still the most employable skill.', parentIdx: null },
      { author: vikram._id, postIdx: 2, content: 'This is incredible! Just went through the React hooks section — the explanation of useTransition for non-blocking state updates is the clearest I\'ve read. Saving this for my prep. Thank you for putting this together!', parentIdx: null },
      { author: sneha._id, postIdx: 2, content: 'The Server Components section is exactly what I needed. My understanding was completely wrong before — I thought SC were just SSR but they\'re fundamentally different. Great notes!', parentIdx: null },
      { author: rahul._id, postIdx: 4, content: 'Context switch sequence: 1) Timer interrupt fires 2) CPU saves current process state (registers, PC, stack pointer) into its PCB (Process Control Block) 3) Scheduler picks the next ready process 4) CPU restores next process\'s PCB state 5) Jumps to saved PC address. For voluntary yield (syscall/sleep), step 1 is different — the process itself calls into the kernel.', parentIdx: null },
      { author: arjun._id, postIdx: 4, content: 'Yes threads have context switches too, which is much cheaper than process context switches — no page table swap, only register/stack state. That\'s the fundamental advantage of threads. Kernel-level threads are scheduled by the OS, user-level threads by a runtime (like Go\'s goroutines or Rust\'s tokio tasks).', parentIdx: null },
      { author: sneha._id, postIdx: 5, content: 'Rule of thumb: composite index (a, b) works for queries on (a), (a, b), but NOT (b) alone. For your example, (status, created_at) is better because status is likely low cardinality (few unique values) — the optimizer filters by status first, then does a range scan on created_at. The selectivity principle: put the most discriminating column first.', parentIdx: null },
      { author: rahul._id, postIdx: 7, content: 'For a student project: go REST if your team isn\'t TypeScript-first and you want to ship faster. GraphQL is powerful but adds real complexity — type generation, resolvers, N+1 problem, etc. that beginners often get wrong. tRPC is excellent if you\'re all-TypeScript, as the type safety across the stack is genuinely magical. Given your context, I\'d say REST first.', parentIdx: null },
      { author: priya._id, postIdx: 7, content: 'Counterpoint: learning GraphQL on a student project is actually the perfect time — when mistakes don\'t cost money. And knowing GraphQL is increasingly valued in interviews. Just make sure to use DataLoader to solve N+1 query problem from day one.', parentIdx: null },
      { author: arjun._id, postIdx: 8, content: 'TCP uses "selective acknowledgment" (SACK) by default in modern implementations. Without SACK (basic TCP): uses Go-Back-N — if packet 5 is lost, receiver discards 6,7,8 and ACKs 4. Sender retransmits from 5. With SACK (modern TCP): receiver buffers 6,7,8 and tells sender "got 6,7,8, missing 5" — sender only retransmits 5. This is why SACK vastly improves throughput on lossy links.', parentIdx: null },
      { author: vikram._id, postIdx: 10, content: 'My professors always say "tabulation avoids recursion stack overhead" which is the practical reason. In Python especially, recursion hits the default 1000 call limit. But the bigger reason: tabulation\'s bottom-up nature makes space optimization possible — for Fibonacci, you only need the last two values, not the full memo table. This is often where interview followups go.', parentIdx: null },
      { author: priya._id, postIdx: 13, content: 'Congratulations Sneha! The advice about contributing PRs before proposal submission is gold. Too many students write proposals without ever having touched the organization\'s codebase. Please do write that "How to get into GSoC" post!', parentIdx: null },
      { author: rahul._id, postIdx: 9, content: 'Using a LinkedHashMap (HashMap + doubly linked list)! HashMap gives O(1) lookup, linked list gives O(1) order tracking (move to front on access, evict tail). Python\'s OrderedDict already bundles this. Java: LinkedHashMap with accessOrder=true. In interviews, being able to draw the data structure first and then code it is the ideal approach.', parentIdx: null },
      { author: arjun._id, postIdx: 14, content: 'For rate limiting, Redis is the standard choice for distributed counting — specifically the INCR + EXPIRE pattern or Lua scripts for atomic operations. The sliding window counter algorithm in Redis: store a sorted set per user where members are request timestamps, prune old entries, and check set size. This avoids the fixed-window "spike at boundary" problem. Look up the "rate-limiter-flexible" npm library for the exact implementation.', parentIdx: null },
    ];

    const createdComments = [];
    for (const c of commentData) {
      const comment = await Comment.create({
        author: c.author,
        postId: posts[c.postIdx]._id,
        parentId: c.parentIdx !== null ? createdComments[c.parentIdx]?._id || null : null,
        content: c.content,
      });
      createdComments.push(comment);
      await Post.findByIdAndUpdate(posts[c.postIdx]._id, { $inc: { commentCount: 1 } });
    }
    console.log(`✅ Created ${createdComments.length} comments`);

    // ─── EVENTS ─────────────────────────────────────────
    const now = new Date();
    const eventData = [
      { title: 'DSA Marathon — Graphs & DP', description: 'A 3-hour competitive coding contest focused on graph algorithms and dynamic programming. Top 3 win Amazon gift cards!', type: 'contest', host: arjun._id, startDate: new Date(Date.now() - 30 * 60 * 1000), endDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000), maxParticipants: 200, prize: '₹5000 Amazon Voucher', status: 'live', registrations: [priya._id, rahul._id, vikram._id] },
      { title: 'System Design AMA with Senior Engineer', description: 'Live doubt session with a senior engineer from a top product company. Submit your system design questions in advance!', type: 'doubt_session', host: arjun._id, startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), maxParticipants: 50, prize: '', status: 'upcoming', registrations: [sneha._id, priya._id] },
      { title: 'ML/AI Quiz — Transformers & LLMs', description: 'Test your knowledge on modern AI/ML concepts including attention mechanism, fine-tuning, and prompt engineering. MCQ format, 30 minutes.', type: 'quiz', host: priya._id, startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), maxParticipants: 100, prize: 'Certificate + Swag', status: 'upcoming', registrations: [rahul._id] },
      { title: 'Web Dev Hackathon — Build in 48 Hours', description: 'Build a full-stack web application in 48 hours. Theme revealed at the start. Teams of 1-4 allowed.', type: 'contest', host: rahul._id, startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), maxParticipants: 100, prize: '₹10000 + Internship referral', status: 'completed', registrations: [arjun._id, sneha._id, vikram._id, priya._id] },
    ];

    const events = await Event.insertMany(eventData);
    console.log(`✅ Created ${events.length} events`);

    // ─── CHALLENGES ─────────────────────────────────────
    const challengeData = [
      {
        title: 'Implement LRU Cache in O(1)',
        description: 'Design and implement a data structure for a Least Recently Used (LRU) cache.\n\nIt should support:\n- get(key): Get the value of the key if it exists, otherwise return -1\n- put(key, value): Insert or update the key-value pair. If the cache exceeds capacity, evict the LRU item.\n\nBoth operations must be O(1) time complexity.\n\nShare your solution (code link or inline) with an explanation of your approach.',
        subject: 'DSA',
        difficulty: 'medium',
        points: 50,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        submissions: [{ userId: vikram._id, answer: 'Using LinkedHashMap with accessOrder=true in Java.', submittedAt: new Date(), score: 50 }]
      },
      {
        title: 'SQL Query Optimization Challenge',
        description: 'Given a slow-running SQL query on a large e-commerce orders table:\n\nSELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as revenue\nFROM users u LEFT JOIN orders o ON u.id = o.user_id\nWHERE o.created_at > \'2024-01-01\' AND o.status = \'completed\'\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 5\nORDER BY revenue DESC;\n\nExplain: 1) Why is this slow? 2) What indexes would you add? 3) Rewrite if necessary.\n\nAssume: users (10M rows), orders (50M rows).',
        subject: 'DBMS',
        difficulty: 'hard',
        points: 80,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        submissions: [
          { userId: sneha._id, answer: 'Add composite index (user_id, status, created_at) on orders table...', submittedAt: new Date(), score: 80 },
          { userId: arjun._id, answer: 'The query is slow because of a full table scan on the orders table...', submittedAt: new Date(), score: 75 },
        ]
      },
    ];

    const challenges = await WeeklyChallenge.insertMany(challengeData);
    console.log(`✅ Created ${challenges.length} weekly challenges`);

    // ─── CONNECTIONS ────────────────────────────────────
    const connectionData = [
      { sender: arjun._id, receiver: priya._id, status: 'accepted' },
      { sender: arjun._id, receiver: rahul._id, status: 'accepted' },
      { sender: priya._id, receiver: rahul._id, status: 'accepted' },
      { sender: sneha._id, receiver: vikram._id, status: 'accepted' },
      { sender: vikram._id, receiver: arjun._id, status: 'pending', message: 'Hi Arjun, loved your Google interview post!' },
      { sender: sneha._id, receiver: priya._id, status: 'pending', message: 'Hi Priya, would love to connect and discuss GSoC.' },
    ];

    const connections = await Connection.insertMany(connectionData);

    await User.findByIdAndUpdate(arjun._id, { $push: { connections: { $each: [priya._id, rahul._id] } }, connectionCount: 2, pendingRequestsCount: 1 });
    await User.findByIdAndUpdate(priya._id, { $push: { connections: { $each: [arjun._id, rahul._id] } }, connectionCount: 2, pendingRequestsCount: 1 });
    await User.findByIdAndUpdate(rahul._id, { $push: { connections: { $each: [arjun._id, priya._id] } }, connectionCount: 2 });
    await User.findByIdAndUpdate(sneha._id, { $push: { connections: [vikram._id] }, connectionCount: 1 });
    await User.findByIdAndUpdate(vikram._id, { $push: { connections: [sneha._id] }, connectionCount: 1 });

    console.log(`✅ Created ${connections.length} connections`);

    console.log('\n🎉 Community seed complete!');
    console.log('\nLogin credentials (all with password: Password123!):');
    userData.forEach((u) => console.log(`  ${u.email}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
