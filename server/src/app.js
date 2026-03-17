const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/error.middleware');

// Legacy routes
const authRoutes = require('./routes/auth.routes');
const mentorRoutes = require('./routes/mentor.routes');
const mentorshipRoutes = require('./routes/mentorship.routes');
const counselingRoutes = require('./routes/counseling.routes');
const internshipRoutes = require('./routes/internship.routes');
const aiRoutes = require('./routes/ai.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const groupRoutes = require('./routes/groups.routes');

// Community section routes
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const votesRoutes = require('./routes/votes.routes');
const usersRoutes = require('./routes/users.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const eventsRoutes = require('./routes/events.routes');
const challengesRoutes = require('./routes/challenges.routes');
const aiCommunityRoutes = require('./routes/ai.community.routes');
const connectionsRoutes = require('./routes/connections.routes');

const app = express();

app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://0.0.0.0:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Education Platform API is running' });
});

// Legacy API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/groups', groupRoutes);

// Community Section Routes
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/vote', votesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/ai-community', aiCommunityRoutes);

app.use(errorHandler);

module.exports = app;
