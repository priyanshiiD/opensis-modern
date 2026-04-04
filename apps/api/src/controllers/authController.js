import bcrypt from 'bcryptjs';
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
import RefreshToken from '../models/refreshToken.model.js';

async function getNextUserId() {
  const latestUser = await User.findOne({}, { userId: 1 }).sort({ userId: -1 }).lean();
  return Number(latestUser?.userId || 0) + 1;
}

export const seedAdmin = async (req, res) => {
  const { username, email, password, seedSecret } = req.body;
  if (seedSecret !== process.env.ADMIN_SEED_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid seed secret.' });
  }
  try {
    const adminExists = await User.findOne({ $or: [{ role: 'admin' }, { profileId: 1 }] });
    if (adminExists) {
      return res.status(409).json({ error: 'Conflict: Admin already seeded.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      userId: await getNextUserId(),
      username,
      email,
      passwordHash,
      role: 'admin',
      profileId: 1
    });

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
    const user = await User.findOne({ usernameLower: normalizeUsername(username) }).select('+passwordHash').lean();

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

    await RefreshToken.create({
      jti: refreshToken.jti,
      userId: userClaims.userId,
      profileId: userClaims.profileId,
      username: userClaims.username,
      role: userClaims.role,
      expiresAt: refreshToken.expiresAt,
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
    const tokenRecord = await RefreshToken.findOne({ jti: decoded.jti }).lean();

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
      await RefreshToken.updateOne({ jti: decoded.jti }, { $set: { revokedAt: new Date() } });
    }

    sendSuccess(res, { loggedOut: true });
  } catch (error) {
    sendError(res, 400, 'LOGOUT_FAILED', `Logout failed: ${error.message}`);
  }
}

export function me(req, res) {
  sendSuccess(res, { user: req.user });
}