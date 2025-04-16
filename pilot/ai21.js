
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route pour traiter les requêtes AI21
router.post('/ai21', async (req, res) => {
    try {
        const { prompt, uid } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Le prompt est requis' });
        }
        
        // ID de conversation (utiliser celui fourni ou en générer un nouveau)
        const conversationId = uid || Date.now().toString();
        
        // Appel à l'API AI21
        const response = await axios.get(`https://ai21.vercel.app/ai21`, {
            params: {
                prompt: prompt,
                uid: conversationId
            }
        });
        
        // Renvoyer la réponse au client
        res.json(response.data);
        
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API AI21:', error);
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.'
        });
    }
});

module.exports = router;
