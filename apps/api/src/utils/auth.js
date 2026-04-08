import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';

export function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

export function mapProfileIdToRole(profileId) {
  const roleMap = {
    0: 'student',
    1: 'admin',
    2: 'teacher',
    3: 'parent',
    4: 'staff'
  };

  return roleMap[profileId] || 'staff';
}

export function permissionsForRole(role) {
  const rolePermissions = {
    admin: ['students:read', 'students:write', 'teachers:read', 'teachers:write', 'attendance:read', 'attendance:write', 'grades:read', 'grades:write', 'admin:manage'],
    teacher: ['students:read', 'attendance:read', 'attendance:write', 'grades:read', 'grades:write'],
    staff: ['students:read', 'attendance:read', 'grades:read'],
    parent: ['students:read'],
    student: ['students:read']
  };

  return rolePermissions[role] || [];
}

export function createAccessToken(user) {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      ...user
    },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenTtl, jwtid: jti }
  );

  return { token, jti };
}

export function createRefreshToken(user) {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      userId: user.userId,
      profileId: user.profileId,
      username: user.username,
      role: user.role
    },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenTtl, jwtid: jti }
  );

  const decoded = jwt.decode(token);

  return {
    token,
    jti,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessTokenSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshTokenSecret);
}
