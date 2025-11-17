const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallet');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const contractRoutes = require('./routes/contracts');
const reviewRoutes = require('./routes/reviews');
const milestoneRoutes = require('./routes/milestones');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// HTTP server + Socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { setIO } = require('./utils/socket');

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
// Add a safe fallback list that includes common dev hosts and the Render frontend
const defaultFrontends = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://kadesh-frontend.onrender.com',
  // Primary vanity domain for the production frontend
  'https://kadesh.onrender.com'
];

const envList = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const allowedOrigins = (envList ? envList.split(',') : [])
  .concat(defaultFrontends)
  .map(s => s.trim())
  .filter((v, i, a) => v && a.indexOf(v) === i);

app.use(cors({
  origin: function(origin, callback) {
    // Allow non-browser tools (curl, Postman) which have no origin
    if (!origin) return callback(null, true);
    // If allowedOrigins not configured (shouldn't happen), allow all origins for dev convenience
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure preflight requests are handled
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    if (req.originalUrl?.startsWith('/api/payments/mercadopago/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/messages', messageRoutes);

// Rotas de compatibilidade (aliases para retro-compatibilidade)
const auth = require('./middleware/auth');
const db = require('./config/database');

// Alias: GET /api/dashboard/stats -> GET /api/users/dashboard/stats
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.type;

    let stats = {};

    if (userType === 'client') {
      // Stats de cliente
      const projectsResult = await db.query(`
        SELECT 
          COUNT(*) as total_projects,
          COUNT(*) FILTER (WHERE status = 'open') as open_projects,
          COUNT(*) FILTER (WHERE status = 'in_progress') as active_projects,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_projects
        FROM projects WHERE client_id = $1 AND status != 'deleted'
      `, [userId]);

      const bidsResult = await db.query(`
        SELECT COUNT(*) as total_bids
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE p.client_id = $1 AND b.status = 'pending'
      `, [userId]);

      stats = {
        ...projectsResult.rows[0],
        pending_bids: parseInt(bidsResult.rows[0].total_bids)
      };
    } else if (userType === 'provider') {
      // Stats de provedor
      const bidsResult = await db.query(`
        SELECT 
          COUNT(*) as total_bids,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_bids,
          COUNT(*) FILTER (WHERE status = 'accepted') as accepted_bids
        FROM bids WHERE provider_id = $1 AND status != 'withdrawn'
      `, [userId]);

      const contractsResult = await db.query(`
        SELECT 
          COUNT(*) as total_contracts,
          COUNT(*) FILTER (WHERE status = 'in_progress') as active_contracts,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_contracts,
          COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_earnings
        FROM contracts WHERE provider_id = $1
      `, [userId]);

      stats = {
        ...bidsResult.rows[0],
        ...contractsResult.rows[0]
      };
    }

    res.json({ stats });

  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    res.status(500).json({
      error: 'Erro ao carregar estatísticas'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET','POST']
  }
});

setIO(io);

const jwt = require('jsonwebtoken');
const db = require('./config/database');

io.on('connection', async (socket) => {
  try {
    const { token } = socket.handshake.auth || socket.handshake.query || {};
    if (!token) {
      socket.disconnect(true);
      return;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = user;

    socket.on('join:contract', async (contractId) => {
      try {
        const { userId } = socket.data.user;
        const result = await db.query(
          'SELECT 1 FROM contracts WHERE id = $1 AND (client_id = $2 OR provider_id = $2) LIMIT 1',
          [contractId, userId]
        );
        if (result.rows.length === 0) return;
        socket.join(`contract:${contractId}`);
      } catch {}
    });

    socket.on('typing', (payload) => {
      const { contract_id } = payload || {};
      if (!contract_id) return;
      socket.to(`contract:${contract_id}`).emit('typing', { from: socket.data.user.userId, at: Date.now() });
    });
  } catch (err) {
    socket.disconnect(true);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Kadesh API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
module.exports = app;
