import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[openai] OPENAI_API_KEY is not set.');
}

export const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ,baseURL: 'https://openrouter.ai/api/v1' });

export const MODEL: string = process.env.OPENAI_MODEL || 'gpt-4o-mini';
