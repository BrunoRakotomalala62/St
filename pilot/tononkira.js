
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Récupérer la liste des chansons d'un artiste
router.get('/recherche', async (req, res) => {
  try {
    const { artiste, page = 1 } = req.query;
    
    if (!artiste) {
      return res.status(400).json({ error: 'Le paramètre artiste est requis' });
    }
    
    const apiUrl = `https://api-tononkira.vercel.app/recherche?artiste=${encodeURIComponent(artiste)}&page=${page}`;
    const response = await axios.get(apiUrl);
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la recherche des chansons:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche' });
  }
});

// Récupérer les paroles d'une chanson spécifique
router.get('/hira', async (req, res) => {
  try {
    const { artiste, lohateny } = req.query;
    
    if (!artiste || !lohateny) {
      return res.status(400).json({ error: 'Les paramètres artiste et lohateny sont requis' });
    }
    
    const apiUrl = `https://api-tononkira.vercel.app/hira?artiste=${encodeURIComponent(artiste)}&lohateny=${encodeURIComponent(lohateny)}`;
    const response = await axios.get(apiUrl);
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des paroles:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des paroles' });
  }
});

module.exports = router;
