const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDb } = require('./config/db');
const apiRoutes = require('./routes');
const { startReminderScheduler } = require('./services/reminderScheduler');

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

async function start() {
  await connectDb(process.env.MONGODB_URI);

  const app = express();

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow non-browser tools (curl/Postman) and dev frontends on any localhost port.
        if (!origin) return cb(null, true);
        if (origin === CLIENT_ORIGIN) return cb(null, true);
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return cb(null, true);
        }
        return cb(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true, name: 'inner-bloom-backend' }));

  app.use('/api', apiRoutes);

  // Basic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  });

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });

  startReminderScheduler();
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

