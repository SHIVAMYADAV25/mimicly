# Persona AI — Chat with Hitesh & Piyush (AI simulations)

An AI-powered chat app that simulates conversations with two well-known Indian
coding educators, **Hitesh** and **Piyush**, built for the *GenAI with JS 2026*
assignment. PERN stack, Neon Postgres, OpenAI, deployed on Vercel.

> These are **stylistic simulations** for an educational project, not the real
> people, and the app says so in the UI and in the persona prompts themselves.

## Stack

- **P**ostgres — [Neon](https://neon.tech) (serverless Postgres)
- **E**xpress — API layer, deployed as a single Vercel serverless function
- **R**eact — Vite + Tailwind frontend
- **N**ode — runtime for the Express app
- **OpenAI** — `gpt-4o-mini` by default (swappable via env var)
- **Vercel** — hosting for both frontend and API

## Project structure

```
persona-ai/
├── api/index.js            # Vercel serverless entrypoint (wraps the Express app)
├── server/
│   ├── app.js               # Express app factory
│   ├── index.js              # local dev entrypoint (node server/index.js)
│   ├── personas/              # system prompts + persona registry
│   │   ├── hitesh.js
│   │   ├── piyush.js
│   │   └── index.js
│   ├── routes/
│   │   ├── chat.js            # POST /api/chat, GET /api/chat/:id/history
│   │   └── personas.js        # GET /api/personas
│   ├── db/
│   │   ├── pool.js            # Neon Postgres connection pool
│   │   ├── schema.sql         # sessions + messages tables
│   │   ├── queries.js         # session/message helpers, sliding-window context
│   │   └── migrate.js         # applies schema.sql to Neon
│   └── lib/openai.js          # OpenAI client wrapper
├── client/                   # Vite + React + Tailwind frontend
│   └── src/
│       ├── App.jsx
│       ├── components/        # PersonaSwitcher, ChatWindow, ChatInput, etc.
│       └── lib/api.js
├── docs/
│   ├── PERSONA_RESEARCH.md    # how persona data was collected & prepared
│   ├── PROMPT_ENGINEERING.md  # prompting strategy, few-shot, CoT
│   ├── CONTEXT_MANAGEMENT.md  # sliding window, trade-offs
│   └── SAMPLE_CONVERSATIONS.md
├── vercel.json
└── package.json
```

## Prerequisites

- Node.js 18+
- A free [Neon](https://neon.tech) Postgres database
- An [OpenAI API key](https://platform.openai.com)
- (For deployment) A [Vercel](https://vercel.com) account

## 1. Clone & install

```bash
git clone <your-fork-url> persona-ai
cd persona-ai
npm install
npm --prefix client install
```

## 2. Configure environment variables

Copy `.env.example` to `.env` in the project root and fill in:

```bash
cp .env.example .env
```

```
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=8787
```

Get `DATABASE_URL` from your Neon project dashboard (Connection Details →
copy the pooled connection string, make sure `?sslmode=require` is included).

## 3. Create the database schema

```bash
npm run db:migrate
```

This runs `server/db/schema.sql` against your Neon database (creates the
`sessions` and `messages` tables).

## 4. Run locally

In one terminal, start the API server:

```bash
npm run dev:server
```

In another terminal, start the frontend:

```bash
npm run dev:client
```

Open **http://localhost:5173** — the Vite dev server proxies `/api/*` to
`http://localhost:8787` automatically (see `client/vite.config.js`).

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Vercel will detect `vercel.json`, which:
   - builds the client with `npm run build:client` and serves `client/dist`
   - deploys `api/index.js` as a serverless function handling all `/api/*` routes
4. Add the same environment variables (`DATABASE_URL`, `OPENAI_API_KEY`,
   `OPENAI_MODEL`) in the Vercel project's **Settings → Environment Variables**.
5. Deploy. Run `npm run db:migrate` once locally (pointed at the same
   `DATABASE_URL`) before first use, if you haven't already — Vercel's
   serverless functions don't run one-off scripts for you.

## How it works

- Each persona (`server/personas/hitesh.js`, `server/personas/piyush.js`) is a
  structured system prompt with voice/tone rules, teaching philosophy, resource-
  sharing behavior, an internal chain-of-thought instruction, and 3–4 few-shot
  examples. See `docs/PROMPT_ENGINEERING.md` for the full reasoning.
- Conversations persist per-persona in Neon Postgres. The server pulls a sliding
  window of the last 16 turns as context on every request — see
  `docs/CONTEXT_MANAGEMENT.md` for why.
- The frontend keeps a separate `sessionId` per persona in `localStorage`, so
  switching between Hitesh and Piyush preserves two independent conversations.

## Documentation

- [`docs/PERSONA_RESEARCH.md`](docs/PERSONA_RESEARCH.md) — how persona traits were
  collected and prepared, and what was deliberately left out
- [`docs/PROMPT_ENGINEERING.md`](docs/PROMPT_ENGINEERING.md) — prompting strategy,
  few-shot design, internal chain-of-thought
- [`docs/CONTEXT_MANAGEMENT.md`](docs/CONTEXT_MANAGEMENT.md) — sliding-window
  context, trade-offs, what a production version would add
- [`docs/SAMPLE_CONVERSATIONS.md`](docs/SAMPLE_CONVERSATIONS.md) — example
  transcripts for both personas

## Notes / limitations

- This project uses a fixed sliding window (last 16 messages) rather than
  summarization for older context — see `docs/CONTEXT_MANAGEMENT.md`.
- Personas are stylistic simulations built from publicly observable teaching
  style; they do not claim to be, or have private information about, the real
  people, and say so if asked directly.
- A basic in-memory per-IP rate limit is applied to `/api/chat` to keep a demo
  deployment from being hammered; for real production use, swap in a proper
  rate limiter backed by Redis or similar.
