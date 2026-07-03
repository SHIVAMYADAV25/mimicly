# Prompt Engineering Strategy

## Architecture: one system prompt per persona, few-shot inside it

Each persona (`server/personas/hitesh.js`, `server/personas/piyush.js`) is a single,
structured system prompt with six sections, always sent in this order:

1. **Identity framing** — states plainly this is a stylistic simulation, not the
   real person (safety + honesty, and it also keeps the model from inventing
   unverifiable biographical claims).
2. **Voice & language** — a rotation of real, observed fillers and speech habits
   (not a fixed script), so replies don't feel copy-pasted from one template.
3. **Teaching philosophy** — the part that actually changes *what* the model says,
   not just *how*. E.g. Hitesh's "never fully spoon-feed a graded-looking task"
   rule changes the actual content of the answer, not just its tone.
4. **Resource-sharing behavior** — persona-specific rules for how they mention their
   own courses/links (casually, one or two at a time — not a docs-style link dump).
5. **Internal reasoning instruction** — a lightweight chain-of-thought instruction
   (see below).
6. **Few-shot examples** — 3–4 hand-written exchanges covering different situation
   types, so the model has concrete targets to pattern-match against, not just rules.

## Why few-shot examples, and why these specific situations

Instructions like "be warm and Hinglish" under-specify *how* warmth shows up in an
actual answer. Three to four worked examples close that gap. We chose situations
that each stress a different part of the persona:

| Example type | What it tests |
|---|---|
| Neutral technical question | Baseline voice on an easy day |
| "Just give me the full solution" | Whether the persona's *pedagogy* survives pressure |
| Emotional/anxious question | Warmth and encouragement under stakes |
| "Do you have a course/link?" | Resource-sharing tone (casual, not a link dump) |

This mirrors how the two personas are meant to differ: Hitesh stays patient and
encouraging even when pushed; Piyush stays direct and reframes toward
production-correctness even in a motivational moment.

## Chain-of-thought, used internally only

Both prompts include an explicit "INTERNAL REASONING (never shown to user)" block:

```
Before answering, silently think through: (1) what is the learner really asking,
(2) what's the simplest correct mental model, (3) what's the smallest example that
teaches it without solving their whole assignment, (4) what persona-appropriate
phrasing fits. Output ONLY the final in-persona reply.
```

We deliberately do **not** ask the model to print its reasoning to the user (no
"Step 1: ... Step 2: ..." in the visible answer). Two reasons:

1. A persona that visibly shows its planning steps breaks immersion — real people
   don't narrate their own thought process before every sentence.
2. For a chat product, exposed chain-of-thought adds latency and token cost without
   adding value the user actually asked for; the value of CoT here is in improving
   the *quality and consistency* of the final answer, which is what the internal
   instruction is used for.

## Persona differentiation levers (not just vocabulary)

To keep the two personas genuinely distinguishable rather than "two accents of the
same assistant," each persona prompt varies along four axes that all feed into the
`chat.completions.create` call, not just the wording:

- **Temperature** — Hitesh runs slightly higher (`0.85`) for more conversational
  variance; Piyush runs a bit lower (`0.75`) to keep his direct, technical style
  tighter and more consistent.
- **Domain gravity** — Hitesh's examples and phrasing lean full-stack/beginner
  friendly; Piyush's lean backend/system-design/production-practices.
- **Pacing** — Hitesh opens warm and builds up; Piyush gets to the point fast, then
  goes deep.
- **What "helping" means** — Hitesh optimizes for the learner trying it themselves;
  Piyush optimizes for the learner understanding the production-grade way to do it.

## Guardrails baked into every persona prompt

- Explicit instruction to clarify (in character, warmly) that it's an AI persona if
  asked directly "are you really him."
- Explicit instruction not to fabricate specific biographical facts, dates, or
  private details — real-world references stay generic and are not presented as
  authoritative claims about the real people.
- Explicit instruction to stay within the coding/tech-mentor persona and not
  roleplay unrelated real people.

## Model & parameters

- Model: `gpt-4o-mini` by default (configurable via `OPENAI_MODEL` env var — swap to
  `gpt-4o` for higher fidelity at higher cost).
- `max_tokens: 700` — long enough for a full explanation with a code block, short
  enough to keep the chat feeling like a conversation rather than a document.
- `presence_penalty: 0.2` — slightly discourages repeating the same filler/phrase
  turn after turn, which otherwise becomes noticeable in a persona built on a small
  set of recurring phrases.
