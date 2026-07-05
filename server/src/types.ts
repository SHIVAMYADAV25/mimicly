export type PersonaId = 'hitesh' | 'piyush';

export type ChatRole = 'user' | 'assistant';

/** A single stored/exchanged chat turn. */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Full internal config for a persona, including its system prompt. */
export interface PersonaConfig {
  id: PersonaId;
  displayName: string;
  tagline: string;
  color: string;
  systemPrompt: string;
  temperature: number;
  greeting: string;
}

/** Public-safe subset returned to the client via GET /api/personas. */
export type PersonaListItem = Omit<PersonaConfig, 'systemPrompt' | 'temperature'>;

/** Row shape for the `sessions` table. */
export interface SessionRow {
  id: string;
  persona: PersonaId;
}

/** Row shape for the `messages` table (as read back from Postgres). */
export interface MessageRow {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  message: string;
  personaId: PersonaId;
  sessionId?: string | null;
}

export interface ChatResponseBody {
  reply: string;
  sessionId: string;
  personaId: PersonaId;
}

export interface ApiErrorBody {
  error: string;
}

export interface HistoryResponseBody {
  messages: MessageRow[];
}

export interface PersonasResponseBody {
  personas: PersonaListItem[];
}
