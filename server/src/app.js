const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mentorRoutes = require('./routes/mentor.routes');
const mentorshipRoutes = require('./routes/mentorship.routes');
const communityRoutes = require('./routes/community.routes');
const counselingRoutes = require('./routes/counseling.routes');
const internshipRoutes = require('./routes/internship.routes');
const companyRoutes = require('./routes/company.routes');
const aiRoutes = require('./routes/ai.routes');
const notificationRoutes = require('./routes/notification.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const opportunityRoutes = require('./routes/opportunity.routes');
const resourceRoutes = require('./routes/resource.routes');
const networkRoutes = require('./routes/network.routes');

const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://0.0.0.0:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // In development, accept any origin to avoid issues when using network IPs.
      if (process.env.NODE_ENV !== 'production') return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Education Platform API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/network', networkRoutes);

// Server static files (uploaded resources, etc)
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
