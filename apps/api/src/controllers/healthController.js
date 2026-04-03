import { getDatabase } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/http.js';

export async function getHealth(_req, res) {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });
    sendSuccess(res, { status: 'ok', db: 'connected' });
  } catch (error) {
    sendError(res, 500, 'DB_UNAVAILABLE', `Database disconnected: ${error.message}`);
  }
}
