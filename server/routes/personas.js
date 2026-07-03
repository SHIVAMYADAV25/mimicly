const express = require('express');
const { listPersonas } = require('../personas');

const router = express.Router();

router.get('/personas', (req, res) => {
  res.json({ personas: listPersonas() });
});

module.exports = router;
