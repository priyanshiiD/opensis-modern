import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB,
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_TTL || '7d'
};

export function validateEnvironment() {
  if (!env.accessTokenSecret || !env.refreshTokenSecret) {
    throw new Error('Missing JWT secrets. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.');
  }

  if (!env.mongoUri || !env.mongoDbName) {
    throw new Error('Missing MongoDB configuration. Set MONGODB_URI and MONGODB_DB.');
  }
}
