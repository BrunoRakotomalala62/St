
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fonction pour récupérer une réponse de l'API AI21
async function getAI21Response(prompt, uid) {
  try {
    // Appel à l'API AI21
    const response = await axios.get(`https://ai21.vercel.app/ai21?prompt=${encodeURIComponent(prompt)}&uid=${uid || '123'}`);
    
    // Renvoyer les données de la réponse
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API AI21:', error);
    throw error;
  }
}

// Route pour obtenir une réponse de l'API AI21
router.get('/', async (req, res) => {
  try {
    const { prompt, uid } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Le prompt est requis' });
    }
    
    // Utiliser la fonction pour obtenir une réponse
    const response = await getAI21Response(prompt, uid);
    
    // Renvoyer la réponse au client
    res.json(response);
    
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API AI21:', error);
    res.status(500).json({ 
      error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
      message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.'
    });
  }
});

// Exporter à la fois le router et la fonction
module.exports = router;
module.exports.getAI21Response = getAI21Response;
