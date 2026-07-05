import express, { Request, Response, Router } from 'express';
import { listPersonas } from '../personas';
import type { PersonasResponseBody } from '../types';

const router: Router = express.Router();

router.get('/personas', (_req: Request, res: Response<PersonasResponseBody>) => {
  res.json({ personas: listPersonas() });
});

export default router;
