require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./config/db'); // Test DB connection on startup

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security Headers Middleware
// app.use(helmet({
//   crossOriginResourcePolicy: false,
//   crossOriginEmbedderPolicy: false,
//   contentSecurityPolicy: false,
//   frameguard: false
// }));

// 2. Strict CORS Middleware (Manual fallback)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 3. Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: { success: false, message: 'Terlalu banyak request dari IP ini, coba lagi nanti.' }
});
app.use('/api/', globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Status Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'OIER Backend API is running smoothly!',
    time: new Date()
  });
});

// API Routes will be mounted here in the future
const materialsRoutes = require('./routes/materials');
const categoriesRoutes = require('./routes/categories');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const notificationsRoutes = require('./routes/notifications');

app.use('/api/materials', materialsRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/categories', categoriesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/notifications', notificationsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err);
  if (!res.headersSent) {
    res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan pada server.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 OIER Backend API is running!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});
