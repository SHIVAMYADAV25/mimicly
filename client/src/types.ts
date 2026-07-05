export type PersonaId = 'hitesh' | 'piyush';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Public persona metadata as returned by GET /api/personas. */
export interface Persona {
  id: PersonaId;
  displayName: string;
  tagline: string;
  color: string;
  greeting: string;
}

export interface PersonaChatState {
  sessionId: string | null;
  messages: ChatMessage[];
}

export type ChatsByPersona = Partial<Record<PersonaId, PersonaChatState>>;

export interface SendMessageParams {
  message: string;
  personaId: PersonaId;
  sessionId: string | null;
}

export interface SendMessageResult {
  reply: string;
  sessionId: string;
  personaId: PersonaId;
}

export interface ApiErrorBody {
  error: string;
}
