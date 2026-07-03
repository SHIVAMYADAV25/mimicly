const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const personasRouter = require('./routes/personas');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api', personasRouter);
  app.use('/api', chatRouter);

  return app;
}

module.exports = { createApp };
