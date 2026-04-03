import cors from 'cors';
import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(healthRoutes);
  app.use(authRoutes);
  app.use(adminRoutes);
  app.use(studentRoutes);

  return app;
}
