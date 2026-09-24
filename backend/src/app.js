const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const asyncHandler = require('./middleware/asyncHandler');
const {
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json({ limit: '100kb' }));

app.get('/health', asyncHandler(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
}));

app.use('/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;