import cors from 'cors';
import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { sendError } from './utils/http.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', studentRoutes);

  app.use((req, res) => {
    sendError(res, 404, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`);
  });

  app.use((err, req, res, next) => {
    console.error('Unhandled API error:', err);

    if (res.headersSent) {
      next(err);
      return;
    }

    const status = Number.isInteger(err?.status) ? err.status : 500;
    const message = status >= 500 ? 'Internal server error.' : (err?.message || 'Request failed.');
    sendError(res, status, 'INTERNAL_ERROR', message);
  });

  return app;
}
