import { sendSuccess } from '../utils/http.js';

export function pingAdmin(_req, res) {
  sendSuccess(res, { pong: true, scope: 'admin' });
}
