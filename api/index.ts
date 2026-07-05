import type { Express } from 'express';
import { createApp } from '../server/src/app';

// Vercel treats this file as a single serverless function handling
// everything under /api/* (see vercel.json rewrites).
const app: Express = createApp();

export default app;
