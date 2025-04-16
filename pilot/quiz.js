const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

function decodeHtmlEntities(text) {
  const entities = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>'
  };
  return text.replace(/&quot;|&amp;|&lt;|&gt;/g, match => entities[match]);
}

router.get('/getQuiz', async (req, res) => {
  try {
    const response = await fetch('https://quiz-gamma-lake.vercel.app/api/trivia');
    const data = await response.json();

    if (!data.quiz) {
      throw new Error('Pas de question reçue');
    }

    res.json({
      original: {
        response: decodeHtmlEntities(data.formatted.english)
      },
      translated: {
        response: decodeHtmlEntities(data.formatted.french)
      }
    });
  } catch (error) {
    console.error('Erreur quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du quiz' });
  }
});

module.exports = router;