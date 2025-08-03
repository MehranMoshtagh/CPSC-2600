require('dotenv').config();
const express = require('express');
const { connectToDb } = require('./db');
const eventsRouter = require('./routes/events');
const rsvpsRouter = require('./routes/rsvps');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
// simple CORS dev helper
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // restrict in production
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    return res.sendStatus(204);
  }
  next();
});

// Basic middleware
app.use(express.json());

// Versioned API
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/events', rsvpsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (should be after routes)
app.use(errorHandler);

// Start server after DB is ready
const PORT = process.env.PORT || 3000;
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, exiting.');
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, exiting.');
  process.exit(0);
});
