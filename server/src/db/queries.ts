import { pool } from './pool';
import type { MessageRow, PersonaId, SessionRow, ChatRole } from '../types';

export const MAX_CONTEXT_MESSAGES = 16; // sliding window, see docs/CONTEXT_MANAGEMENT.md

export async function ensureSession(
  sessionId: string | null | undefined,
  persona: PersonaId
): Promise<SessionRow> {
  if (sessionId) {
    const existing = await pool.query<SessionRow>(
      'SELECT id, persona FROM sessions WHERE id = $1',
      [sessionId]
    );
    if (existing.rows.length) return existing.rows[0];
  }
  const created = await pool.query<SessionRow>(
    'INSERT INTO sessions (persona) VALUES ($1) RETURNING id, persona',
    [persona]
  );
  return created.rows[0];
}

export async function getRecentMessages(
  sessionId: string,
  limit: number = MAX_CONTEXT_MESSAGES
): Promise<MessageRow[]> {
  const result = await pool.query<MessageRow>(
    `SELECT role, content FROM messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [sessionId, limit]
  );
  return result.rows.reverse(); // chronological order
}

export async function saveMessage(
  sessionId: string,
  role: ChatRole,
  content: string
): Promise<void> {
  await pool.query('INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)', [
    sessionId,
    role,
    content,
  ]);
}
