# Context Management Approach

## Storage

Every conversation turn is persisted in Neon Postgres:

- `sessions` — one row per (persona, browser session). Created lazily on first message.
- `messages` — every user/assistant turn, tagged with `session_id`, `role`, `content`,
  `created_at`.

The client keeps a `sessionId` per persona in `localStorage`, so switching between
Hitesh and Piyush preserves two independent conversations, and reloading the page
resumes exactly where you left off (`client/src/App.jsx`).

## Sliding window (not full history)

On every request, the server pulls only the **last `MAX_CONTEXT_MESSAGES` (16) turns**
for that session (`server/db/queries.js: getRecentMessages`) and prepends the persona's
system prompt. We deliberately did not send the entire conversation history for three
reasons:

1. **Cost** — token cost scales with context size on every single turn, not just once.
   A long-running study session could otherwise make every message progressively
   more expensive.
2. **Latency** — bigger context = slower time-to-first-token, which matters a lot in
   a chat UI where responsiveness is part of the "feel" of a persona.
3. **Persona drift is more about the system prompt than raw history length** — since
   the system prompt is re-sent on every call with the full trait sheet, the model
   doesn't need 100 turns of history to "remember how to sound like Hitesh"; it needs
   the system prompt (constant) plus recent conversational grounding (sliding window).

## Trade-offs / what this does NOT do (yet)

- **No summarization step.** For very long sessions (60+ turns), older context is
  simply dropped rather than compressed into a running summary. This is a reasonable
  v1 trade-off — most demo/practice conversations for this assignment are well under
  16 turns — but a production version would add a background summarization job that
  periodically compresses older turns into a short "memory note" prepended to the
  system prompt, so long-term facts (e.g. "the user is building a to-do app in
  Express") survive past the window.
- **No cross-persona memory.** Hitesh and Piyush do not currently know about each
  other's conversation with the same user. This is intentional for this assignment
  (keeps evaluation of "maintains persona" clean per-persona) but could be extended
  with a shared user-profile table if desired.
- **No embedding-based retrieval.** For this scope, a simple recency window is enough.
  If conversations grew much longer or needed to recall specific facts from far back
  (e.g. "what did I tell you about my project stack 200 messages ago"), the natural
  next step is a lightweight RAG layer over past messages (pgvector on the same Neon
  instance is a natural fit) rather than growing the raw window further.

## Per-turn flow

```
POST /api/chat { message, personaId, sessionId }
  -> ensureSession(sessionId, personaId)      // create if missing
  -> getRecentMessages(sessionId, 16)         // sliding window
  -> messages = [system, ...history, newUserMsg]
  -> OpenAI chat.completions.create(...)
  -> saveMessage(user), saveMessage(assistant)
  -> return { reply, sessionId }
```
