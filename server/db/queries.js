const { pool } = require('./pool');

const MAX_CONTEXT_MESSAGES = 16; // sliding window, see docs/CONTEXT_MANAGEMENT.md

async function ensureSession(sessionId, persona) {
  if (sessionId) {
    const existing = await pool.query('SELECT id, persona FROM sessions WHERE id = $1', [
      sessionId,
    ]);
    if (existing.rows.length) return existing.rows[0];
  }
  const created = await pool.query(
    'INSERT INTO sessions (persona) VALUES ($1) RETURNING id, persona',
    [persona]
  );
  return created.rows[0];
}

async function getRecentMessages(sessionId, limit = MAX_CONTEXT_MESSAGES) {
  const result = await pool.query(
    `SELECT role, content FROM messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [sessionId, limit]
  );
  return result.rows.reverse(); // chronological order
}

async function saveMessage(sessionId, role, content) {
  await pool.query(
    'INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)',
    [sessionId, role, content]
  );
}

module.exports = { ensureSession, getRecentMessages, saveMessage, MAX_CONTEXT_MESSAGES };
