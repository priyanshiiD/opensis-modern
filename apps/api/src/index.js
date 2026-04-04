import { createApp } from './app.js';
import { connectDatabase, ensureIndexes } from './config/db.js';
import { env, validateEnvironment } from './config/env.js';

validateEnvironment();

const app = createApp();

async function start() {
  await connectDatabase();
  await ensureIndexes();
  console.log('✅ MongoDB connected successfully!');

  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port} with MongoDB ${env.mongoDbName}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});