import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import personasRouter from './routes/personas';

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }));
  app.use('/api', personasRouter);
  app.use('/api', chatRouter);

  return app;
}
