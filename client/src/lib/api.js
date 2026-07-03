const BASE = '/api';

export async function fetchPersonas() {
  const res = await fetch(`${BASE}/personas`);
  if (!res.ok) throw new Error('Failed to load personas');
  const data = await res.json();
  return data.personas;
}

export async function sendMessage({ message, personaId, sessionId }) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, personaId, sessionId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message');
  }
  return res.json();
}
