import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from './pool';

async function migrate(): Promise<void> {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  // eslint-disable-next-line no-console
  console.log('Migration applied successfully.');
  await pool.end();
}

migrate().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', err);
  process.exit(1);
});
