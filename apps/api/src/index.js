import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB;
const accessTokenSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const accessTokenTtl = process.env.JWT_ACCESS_TTL || '15m';
const refreshTokenTtl = process.env.JWT_REFRESH_TTL || '7d';

const userCollectionName = 'login_authentication';
const studentCollectionName = 'students';
const refreshTokenCollectionName = 'auth_refresh_tokens';

const mongoClient = mongoUri ? new MongoClient(mongoUri) : null;
let databasePromise = null;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error('Missing JWT secrets. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.');
}

if (!mongoUri || !mongoDbName) {
  throw new Error('Missing MongoDB configuration. Set MONGODB_URI and MONGODB_DB.');
}

app.use(cors());
app.use(express.json());

function sendSuccess(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

function sendError(res, status, code, message) {
  res.status(status).json({
    success: false,
    error: { code, message }
  });
}

function mapProfileIdToRole(profileId) {
  const roleMap = {
    0: 'student',
    1: 'admin',
    2: 'teacher',
    3: 'parent',
    4: 'staff'
  };

  return roleMap[profileId] || 'staff';
}

function permissionsForRole(role) {
  const rolePermissions = {
    admin: ['students:read', 'students:write', 'attendance:read', 'attendance:write', 'grades:read', 'grades:write', 'admin:manage'],
    teacher: ['students:read', 'attendance:read', 'attendance:write', 'grades:read', 'grades:write'],
    staff: ['students:read', 'attendance:read', 'grades:read'],
    parent: ['students:read'],
    student: ['students:read']
  };

  return rolePermissions[role] || [];
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = mongoClient.connect().then((client) => client.db(mongoDbName));
  }

  return databasePromise;
}

async function ensureIndexes(database) {
  await Promise.all([
    database.collection(userCollectionName).createIndex({ usernameLower: 1 }, { unique: true }),
    database.collection(refreshTokenCollectionName).createIndex({ jti: 1 }, { unique: true }),
    database.collection(refreshTokenCollectionName).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection(studentCollectionName).createIndex({ studentId: -1 }, { unique: true })
  ]);
}

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

function createAccessToken(user) {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      ...user
    },
    accessTokenSecret,
    { expiresIn: accessTokenTtl, jwtid: jti }
  );

  return { token, jti };
}

function createRefreshToken(user) {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      userId: user.userId,
      profileId: user.profileId,
      username: user.username,
      role: user.role
    },
    refreshTokenSecret,
    { expiresIn: refreshTokenTtl, jwtid: jti }
  );

  const decoded = jwt.decode(token);

  return {
    token,
    jti,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, 'UNAUTHORIZED', 'Missing bearer token.');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, accessTokenSecret);

    req.user = decoded;
    next();
  } catch {
    sendError(res, 401, 'INVALID_TOKEN', 'Invalid or expired token.');
  }
}

function requirePermissions(...requiredPermissions) {
  return (req, res, next) => {
    const permissions = req.user?.permissions || [];
    const hasAllPermissions = requiredPermissions.every((permission) => permissions.includes(permission));

    if (!hasAllPermissions) {
      sendError(res, 403, 'FORBIDDEN', 'Insufficient permissions for this resource.');
      return;
    }

    next();
  };
}

app.get('/health', async (_req, res) => {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });
    sendSuccess(res, { status: 'ok', db: 'connected' });
  } catch (error) {
    sendError(res, 500, 'DB_UNAVAILABLE', `Database disconnected: ${error.message}`);
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    sendError(res, 400, 'VALIDATION_ERROR', 'Username and password are required.');
    return;
  }

  try {
    const database = await getDatabase();
    const user = await database.collection(userCollectionName).findOne({ usernameLower: normalizeUsername(username) });

    if (!user) {
      sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid username or password.');
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid username or password.');
      return;
    }

    const role = mapProfileIdToRole(Number(user.profileId));
    const userClaims = {
      userId: Number(user.userId),
      profileId: Number(user.profileId),
      username: String(user.username),
      role,
      permissions: permissionsForRole(role)
    };

    const accessToken = createAccessToken(userClaims);
    const refreshToken = createRefreshToken(userClaims);

    await database.collection(refreshTokenCollectionName).insertOne({
      jti: refreshToken.jti,
      userId: userClaims.userId,
      profileId: userClaims.profileId,
      username: userClaims.username,
      role: userClaims.role,
      expiresAt: refreshToken.expiresAt,
      createdAt: new Date(),
      revokedAt: null
    });

    sendSuccess(res, {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      user: userClaims
    });
  } catch (error) {
    sendError(res, 500, 'LOGIN_FAILED', `Login failed: ${error.message}`);
  }
});

app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    sendError(res, 400, 'VALIDATION_ERROR', 'refreshToken is required.');
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const database = await getDatabase();
    const tokenRecord = await database.collection(refreshTokenCollectionName).findOne({ jti: decoded.jti });

    if (!tokenRecord || tokenRecord.revokedAt) {
      sendError(res, 401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or revoked.');
      return;
    }

    const userClaims = {
      userId: Number(decoded.userId),
      profileId: Number(decoded.profileId),
      username: String(decoded.username),
      role: decoded.role,
      permissions: permissionsForRole(decoded.role)
    };

    const accessToken = createAccessToken(userClaims);
    sendSuccess(res, { accessToken: accessToken.token, user: userClaims });
  } catch {
    sendError(res, 401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.');
  }
});

app.post('/auth/logout', authMiddleware, async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);
      const database = await getDatabase();
      await database.collection(refreshTokenCollectionName).updateOne(
        { jti: decoded.jti },
        { $set: { revokedAt: new Date() } }
      );
    }

    sendSuccess(res, { loggedOut: true });
  } catch (error) {
    sendError(res, 400, 'LOGOUT_FAILED', `Logout failed: ${error.message}`);
  }
});

app.get('/auth/me', authMiddleware, (req, res) => {
  sendSuccess(res, { user: req.user });
});

app.get('/admin/ping', authMiddleware, requirePermissions('admin:manage'), (_req, res) => {
  sendSuccess(res, { pong: true, scope: 'admin' });
});

app.get('/students', authMiddleware, requirePermissions('students:read'), async (_req, res) => {
  try {
    const database = await getDatabase();
    const rows = await database
      .collection(studentCollectionName)
      .find({}, { projection: { _id: 0, studentId: 1, firstName: 1, lastName: 1 } })
      .sort({ studentId: -1 })
      .limit(100)
      .toArray();

    sendSuccess(res, { students: rows });
  } catch (error) {
    sendError(res, 500, 'STUDENTS_FETCH_FAILED', `Failed to fetch students: ${error.message}`);
  }
});

async function start() {
  const database = await getDatabase();
  await ensureIndexes(database);

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port} with MongoDB ${mongoDbName}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
