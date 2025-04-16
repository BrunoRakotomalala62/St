
const express = require('express');
const router = express.Router();

router.get('/create', async (req, res) => {
  try {
    const response = await fetch('https://api-test-liart-alpha.vercel.app/create');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'adresse email' });
  }
});

router.get('/inbox', async (req, res) => {
  try {
    const email = req.query.email;
    const response = await fetch(`https://api-test-liart-alpha.vercel.app/inbox?message=${email}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

module.exports = router;
