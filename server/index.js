require('dotenv').config();
const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Persona AI server listening on http://localhost:${PORT}`);
});
