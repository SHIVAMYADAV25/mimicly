const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[openai] OPENAI_API_KEY is not set.');
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ,baseURL: 'https://openrouter.ai/api/v1' });

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

module.exports = { client, MODEL };
