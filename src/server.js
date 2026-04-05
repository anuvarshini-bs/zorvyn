require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initializeDb } = require('./models/schema');
const { authenticate } = require('./middleware/auth');
const { requireRole } = require('./middleware/roleCheck');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/users', authenticate, requireRole(['Admin']), userRoutes);
app.use('/api/records', authenticate, recordRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function startServer() {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
