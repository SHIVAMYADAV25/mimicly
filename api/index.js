const { createApp } = require('../server/app');

// Vercel treats this file as a single serverless function handling
// everything under /api/* (see vercel.json rewrites).
module.exports = createApp();
