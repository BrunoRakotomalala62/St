
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint pour vérifier la grammaire d'un texte
router.post('/check', async (req, res) => {
    try {
        const { text, language } = req.body;
        
        if (!text) {
            return res.status(400).json({
                error: 'Le texte est requis'
            });
        }
        
        // Dans un environnement de production, vous utiliseriez une vraie API de correction
        // Pour cette démo, nous simulons une réponse
        
        let corrected = text;
        let errors = [];
        
        // Exemples de corrections basiques
        if (language === 'fr') {
            // Exemple de correction française
            if (text.includes('je sui')) {
                corrected = text.replace(/je sui/g, 'je suis');
                errors.push({
                    message: 'Conjugaison incorrecte du verbe être',
                    text: 'je sui',
                    suggestions: ['je suis']
                });
            }
        } else if (language === 'en') {
            // Exemple de correction anglaise
            if (text.includes('I is')) {
                corrected = text.replace(/I is/g, 'I am');
                errors.push({
                    message: 'Use a first-person singular verb.',
                    text: 'is',
                    suggestions: ['am']
                });
            }
            
            if (text.includes('engeneer')) {
                corrected = text.replace(/engeneer/g, 'engineer');
                errors.push({
                    message: 'Did you mean "engineer"?',
                    text: 'engeneer',
                    suggestions: ['engineer']
                });
            }
        }
        
        // Création de la réponse
        const response = {
            original: text,
            corrected: corrected,
            language: language,
            errors: errors,
            status: errors.length > 0 ? 'corrected' : 'perfect'
        };
        
        return res.json(response);
        
    } catch (error) {
        console.error('Erreur de correction grammaticale:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la correction grammaticale'
        });
    }
});

module.exports = router;
