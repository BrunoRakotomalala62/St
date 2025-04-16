
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route pour traiter les requêtes AI21
router.post('/ai21', async (req, res) => {
    try {
        const { prompt, uid } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                error: 'Le prompt est requis',
                message: 'Veuillez fournir un message à envoyer au chatbot.'
            });
        }
        
        // ID de conversation (utiliser celui fourni ou en générer un nouveau)
        const conversationId = uid || Date.now().toString();
        
        console.log(`Envoi de la requête à AI21 avec prompt: "${prompt}" et uid: ${conversationId}`);
        
        // Appel à l'API AI21
        const response = await axios.post('https://ai21.vercel.app/ai21', {
            prompt: prompt,
            uid: conversationId
        });
        
        console.log('Réponse reçue de l\'API AI21:', response.data);
        
        // Renvoyer la réponse au client
        res.json(response.data);
        
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API AI21:', error.message);
        
        // Réponse d'erreur plus détaillée
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.',
            details: error.message
        });
    }
});

module.exports = router;
