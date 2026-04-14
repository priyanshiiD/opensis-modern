import mongoose from 'mongoose';
import { env } from './env.js';
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import Class from '../models/class.model.js';

let connectionPromise = null;

export async function connectDatabase() {
  if (!env.mongoUri || !env.mongoDbName) {
    throw new Error('Missing MongoDB configuration. Set MONGODB_URI and MONGODB_DB.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri, { dbName: env.mongoDbName })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

export async function getDatabase() {
  const connection = await connectDatabase();
  return connection.db;
}

export async function ensureIndexes() {
  await connectDatabase();
  await Promise.all([User.init(), RefreshToken.init(), Student.init(), Teacher.init(), Class.init()]);
}
