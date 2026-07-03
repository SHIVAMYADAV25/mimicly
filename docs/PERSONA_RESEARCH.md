# Persona Data Collection & Preparation

## Sources studied

For each persona, style was derived from **publicly available, non-transcribed
impressions** of their teaching content — not scraped verbatim text:

- YouTube channel content style (video titles, on-camera teaching cadence, the
  general vocabulary and phrases used across many videos)
- Publicly given talks / podcast appearances
- Public social posts (X/Twitter, LinkedIn) for tone in short-form writing
- The reference sites (`hitesh.ai`, `piyushgarg.dev`) for how each presents
  themselves and their focus areas

We deliberately did **not** scrape and feed raw transcripts into the prompt.
Two reasons:

1. **Copyright / ToS** — bulk-copying video transcripts or site text into a
   prompt (and effectively into a product) is legally and ethically murky.
2. **Style transfer works better from distilled traits than raw text.**
   Feeding a model 10,000 words of transcript tends to make it *quote-mine*
   rather than *generalize* the voice. A compact, well-structured trait sheet
   (vocabulary, sentence rhythm, pedagogy, recurring phrases) generalizes to
   new questions far better.

## What was extracted, per persona

For both personas we captured the same six trait categories:

| Category | What we captured |
|---|---|
| **Language mix** | Ratio and style of Hindi-English code-switching (Hinglish), not textbook Hindi |
| **Recurring phrases** | 6–10 authentic-sounding fillers/openers used across many replies, not just one |
| **Sentence rhythm** | Short vs long sentences, how explanations are structured (concept → analogy → example) |
| **Teaching philosophy** | What the person visibly optimizes for when teaching (projects vs theory, docs-reading, production practices, etc.) |
| **Tone/energy** | Warmth vs directness, how mistakes/beginners are handled |
| **Domain focus** | Topics the persona naturally gravitates to (Hitesh: full-stack/beginner-friendly; Piyush: backend/system design/production) |

These traits were written into structured system prompts
(`server/personas/hitesh.js`, `server/personas/piyush.js`) rather than kept as
loose notes, so the same trait sheet is what actually drives generation.

## Explicit non-goals / guardrails

- The personas are **stylistic simulations**, clearly labeled as AI personas
  in the UI ("AI persona · simulation" tag) and in the system prompt itself.
- No private biographical facts, unverified claims, dates, or company details
  are asserted. If a user asks something the model doesn't actually know,
  the persona is instructed to stay generic rather than fabricate specifics.
- If a user directly asks "are you the real person," both personas are
  instructed to clarify they're an AI simulation, in-character and warmly.

## Why few-shot examples instead of only trait descriptions

Trait descriptions (e.g. "uses Hinglish, warm tone") tell the model *what*
to do but not *how it sounds in practice*. We added 3 hand-written few-shot
exchanges per persona covering three different situations:

1. A neutral technical question (tests baseline voice)
2. A "just give me the full solution" request (tests the pedagogy — does the
   persona push back the way they actually would?)
3. An emotional / motivational question (tests warmth and encouragement style)

This mirrors how the real people differ: Hitesh leans encouraging and
patient even under pressure; Piyush stays direct and reframes toward
production correctness even in a motivational moment. See
`docs/PROMPT_ENGINEERING.md` for the full reasoning.
