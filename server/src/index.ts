import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const PORT: number = Number(process.env.PORT) || 8787;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Persona AI server listening on http://localhost:${PORT}`);
});
