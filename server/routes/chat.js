const express = require('express');
const { getPersona } = require('../personas');
const { ensureSession, getRecentMessages, saveMessage } = require('../db/queries');
const { client, MODEL } = require('../lib/openai');

const router = express.Router();

// naive per-IP rate limit so a demo deployment doesn't get hammered
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

router.post('/chat', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (rateLimited(String(ip))) {
      return res.status(429).json({ error: 'Too many requests, thoda ruk ke try karo.' });
    }

    const { message, personaId, sessionId } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    const persona = getPersona(personaId);
    if (!persona) {
      return res.status(400).json({ error: 'Unknown or missing personaId' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message too long (max 4000 chars).' });
    }

    const session = await ensureSession(sessionId, persona.id);

    // Context management: sliding window of recent turns pulled from Neon.
    // See docs/CONTEXT_MANAGEMENT.md for the reasoning/trade-offs.
    const history = await getRecentMessages(session.id);

    const chatMessages = [
      { role: 'system', content: persona.systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: chatMessages,
      temperature: persona.temperature,
      // max_tokens: 700,
      presence_penalty: 0.2,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'No response from model' });
    }

    await saveMessage(session.id, 'user', message.trim());
    await saveMessage(session.id, 'assistant', reply);

    return res.json({ reply, sessionId: session.id, personaId: persona.id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[chat] error', err);
    return res.status(500).json({ error: 'Something went wrong generating a reply.' });
  }
});

router.get('/chat/:sessionId/history', async (req, res) => {
  try {
    const history = await getRecentMessages(req.params.sessionId, 100);
    return res.json({ messages: history });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[history] error', err);
    return res.status(500).json({ error: 'Could not load history' });
  }
});

module.exports = router;
