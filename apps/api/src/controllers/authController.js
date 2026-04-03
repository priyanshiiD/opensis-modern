import bcrypt from 'bcryptjs';
import { getDatabase } from '../config/db.js';
import { collections } from '../config/constants.js';
import {
  createAccessToken,
  createRefreshToken,
  mapProfileIdToRole,
  normalizeUsername,
  permissionsForRole,
  verifyRefreshToken
} from '../utils/auth.js';
import { sendError, sendSuccess } from '../utils/http.js';

import User from '../models/user.model.js'; 

export const seedAdmin = async (req, res) => {
  const { username,email, password, seedSecret } = req.body;
  if (seedSecret !== process.env.ADMIN_SEED_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid seed secret.' });
  }
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(409).json({ error: 'Conflict: Admin already seeded.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'admin', 
    });

    await newAdmin.save();

    return res.status(201).json({ message: 'Admin account successfully seeded.' });

  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ error: 'Internal server error during seeding.' });
  }
};


export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    sendError(res, 400, 'VALIDATION_ERROR', 'Username and password are required.');
    return;
  }

  try {
    const database = await getDatabase();
    const user = await database.collection(collections.users).findOne({ usernameLower: normalizeUsername(username) });

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

    await database.collection(collections.refreshTokens).insertOne({
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
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    sendError(res, 400, 'VALIDATION_ERROR', 'refreshToken is required.');
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const database = await getDatabase();
    const tokenRecord = await database.collection(collections.refreshTokens).findOne({ jti: decoded.jti });

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
}

export async function logout(req, res) {
  const { refreshToken } = req.body;

  try {
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      const database = await getDatabase();
      await database.collection(collections.refreshTokens).updateOne(
        { jti: decoded.jti },
        { $set: { revokedAt: new Date() } }
      );
    }

    sendSuccess(res, { loggedOut: true });
  } catch (error) {
    sendError(res, 400, 'LOGOUT_FAILED', `Logout failed: ${error.message}`);
  }
}

export function me(req, res) {
  sendSuccess(res, { user: req.user });
}