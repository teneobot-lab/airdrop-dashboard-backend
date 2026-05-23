const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const walletRoutes = require('./src/routes/walletRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;

// Dynamic CORS origins
const getAllowedOrigins = () => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  const vercelDeployment = process.env.VERCEL_DEPLOYMENT_URL;
  return [frontendOrigin, vercelDeployment, /\.vercel\.app$/].filter(Boolean);
};

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.some(o => {
      if (o instanceof RegExp) return o.test(origin);
      return o === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/wallets', walletRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Airdrop Dashboard API running on port ${PORT}`);
});