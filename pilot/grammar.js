
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint pour vérifier la grammaire d'un texte
router.post('/check', async (req, res) => {
    try {
        const { text, language = 'fr' } = req.body;
        
        if (!text) {
            return res.status(400).json({
                error: 'Le texte est requis'
            });
        }
        
        // Récupération de la clé API depuis les variables d'environnement
        const TEXTGEARS_API_KEY = process.env.TEXTGEARS_API_KEY;
        
        if (!TEXTGEARS_API_KEY) {
            console.error('Clé API TextGears manquante');
            return res.status(500).json({
                error: 'Configuration du service incomplète'
            });
        }
        
        // Appel à l'API TextGears
        const apiResponse = await axios.get('https://api.textgears.com/check.php', {
            params: {
                text: text,
                language: language === 'fr' ? 'fr-FR' : 'en-US', // Conversion du code de langue
                key: TEXTGEARS_API_KEY
            }
        });
        
        // Traitement de la réponse de l'API
        if (apiResponse.data && apiResponse.data.status) {
            const errors = apiResponse.data.errors || [];
            
            // Construction de la réponse formatée
            let correctedText = text;
            const formattedErrors = [];
            
            // Traitement des erreurs et corrections
            errors.forEach(error => {
                formattedErrors.push({
                    message: error.description || 'Erreur grammaticale',
                    text: error.bad || '',
                    suggestions: error.better || []
                });
                
                // Application des corrections si disponibles
                if (error.bad && error.better && error.better.length > 0) {
                    correctedText = correctedText.replace(error.bad, error.better[0]);
                }
            });
            
            // Création de la réponse
            const response = {
                original: text,
                corrected: correctedText,
                language: language,
                errors: formattedErrors,
                status: formattedErrors.length > 0 ? 'corrected' : 'perfect'
            };
            
            return res.json(response);
        } else {
            throw new Error('Réponse invalide de l\'API TextGears');
        }
        
    } catch (error) {
        console.error('Erreur de correction grammaticale:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la correction grammaticale',
            details: error.message
        });
    }
});

module.exports = router;
