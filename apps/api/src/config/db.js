import { MongoClient } from 'mongodb';
import { env } from './env.js';
import { collections } from './constants.js';

const mongoClient = env.mongoUri ? new MongoClient(env.mongoUri) : null;
let databasePromise = null;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = mongoClient.connect().then((client) => client.db(env.mongoDbName));
  }

  return databasePromise;
}

export async function ensureIndexes(database) {
  await Promise.all([
    database.collection(collections.users).createIndex({ usernameLower: 1 }, { unique: true }),
    database.collection(collections.refreshTokens).createIndex({ jti: 1 }, { unique: true }),
    database.collection(collections.refreshTokens).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection(collections.students).createIndex({ studentId: -1 }, { unique: true })
  ]);
}
