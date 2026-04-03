import { sendError } from '../utils/http.js';
import { verifyAccessToken } from '../utils/auth.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, 'UNAUTHORIZED', 'Missing bearer token.');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch {
    sendError(res, 401, 'INVALID_TOKEN', 'Invalid or expired token.');
  }
}

export function requirePermissions(...requiredPermissions) {
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
