const express = require('express');
const router = express.Router();
const axios = require('axios');

// Use JSON middleware
router.use(express.json());

// Fonction pour diviser le texte en morceaux de taille acceptable
function chunkText(text, maxLength = 500) {
  if (text.length <= maxLength) return [text];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    // Chercher un point, une virgule ou un espace près de maxLength
    let end = Math.min(start + maxLength, text.length);

    if (end < text.length) {
      // Chercher un point de séparation naturel
      const lastPeriod = text.lastIndexOf('.', end);
      const lastComma = text.lastIndexOf(',', end);
      const lastSpace = text.lastIndexOf(' ', end);

      const breakPoint = Math.max(
        lastPeriod > start ? lastPeriod + 1 : start,
        lastComma > start ? lastComma + 1 : start,
        lastSpace > start ? lastSpace + 1 : start
      );

      end = breakPoint > start ? breakPoint : end;
    }

    chunks.push(text.substring(start, end));
    start = end;
  }

  return chunks;
}

router.post('/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Le texte et la langue cible sont requis' });
    }

    // Diviser le texte en morceaux pour respecter la limite de MyMemory
    const textChunks = chunkText(text);
    let translatedText = '';

    // Essayer de récupérer la langue détectée depuis la première réponse
    let detectedLanguage = 'auto-détecté';
    // Stocke la dernière réponse de l'API pour récupérer la langue détectée
    let lastResponse;

    // Construire la paire de langues pour l'API
    const langPair = sourceLang === 'auto' ? 
      `|${targetLang}` : 
      `${sourceLang}|${targetLang}`;

    // Traduire chaque morceau séparément
    for (const chunk of textChunks) {
      lastResponse = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: chunk,
          langpair: langPair,
          de: 'brunorakotomalala62@gmail.com' // Email pour augmenter la limite quotidienne
        }
      });

      if (lastResponse.data && lastResponse.data.responseData) {
        translatedText += lastResponse.data.responseData.translatedText + ' ';
      } else {
        throw new Error('Erreur lors de la traduction');
      }
    }

    if (textChunks.length > 0 && lastResponse && lastResponse.data && lastResponse.data.responseData && lastResponse.data.responseData.detectedLanguage) {
      detectedLanguage = lastResponse.data.responseData.detectedLanguage;
    }

    res.json({ 
      translatedText: translatedText.trim(),
      detectedLanguage: detectedLanguage
    });

  } catch (error) {
    console.error('Erreur de traduction:', error);
    res.status(500).json({ 
      error: 'Une erreur s\'est produite lors de la traduction',
      details: error.message 
    });
  }
});

module.exports = router;