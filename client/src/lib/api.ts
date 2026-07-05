import type { ApiErrorBody, Persona, SendMessageParams, SendMessageResult } from '../types';

const BASE = '/api';

export async function fetchPersonas(): Promise<Persona[]> {
  const res = await fetch(`${BASE}/personas`);
  if (!res.ok) throw new Error('Failed to load personas');
  const data = (await res.json()) as { personas: Persona[] };
  return data.personas;
}

export async function sendMessage({
  message,
  personaId,
  sessionId,
}: SendMessageParams): Promise<SendMessageResult> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, personaId, sessionId }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as Partial<ApiErrorBody>;
    throw new Error(err.error || 'Failed to send message');
  }
  return (await res.json()) as SendMessageResult;
}
