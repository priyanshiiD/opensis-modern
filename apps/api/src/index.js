import mongoose from 'mongoose'; 
import { createApp } from './app.js';
import { ensureIndexes, getDatabase } from './config/db.js';
import { env, validateEnvironment } from './config/env.js';

validateEnvironment();

const app = createApp();

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB 
    });
    console.log('✅ Mongoose successfully connected!');
  } catch (mongooseError) {
    console.error('❌ Mongoose failed to connect:', mongooseError);
    process.exit(1); 
  }
  const database = await getDatabase();
  await ensureIndexes(database);

  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port} with MongoDB ${env.mongoDbName}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});