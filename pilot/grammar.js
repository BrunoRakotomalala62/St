const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware pour parser le JSON dans les requêtes
router.use(express.json());

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

        // Conversion du code de langue pour TextGears
        const langCode = 
            language === 'fr' ? 'fr-FR' : 
            language === 'en-US' ? 'en-US' :
            language === 'en-GB' ? 'en-GB' :
            language === 'en-ZA' ? 'en-ZA' :
            language === 'en-AU' ? 'en-AU' :
            language === 'en-NZ' ? 'en-NZ' :
            language === 'en' ? 'en-GB' :
            language === 'de-DE' ? 'de-DE' :
            language === 'de-AT' ? 'de-AT' :
            language === 'de-CH' ? 'de-CH' :
            language === 'de' ? 'de-DE' :
            language === 'pt-PT' ? 'pt-PT' :
            language === 'pt-BR' ? 'pt-BR' :
            language === 'it-IT' ? 'it-IT' :
            language === 'it' ? 'it-IT' :
            language === 'ar-AR' ? 'ar-AR' :
            language === 'ru-RU' ? 'ru-RU' :
            language === 'es-ES' ? 'es-ES' :
            language === 'es' ? 'es-ES' :
            language === 'ja-JP' ? 'ja-JP' :
            language === 'zh-CN' ? 'zh-CN' :
            language === 'el-GR' ? 'el-GR' : 'en-GB';

        // Appel à l'API TextGears pour la vérification grammaticale
        const apiResponse = await axios.get('https://api.textgears.com/grammar', {
            params: {
                text: text,
                language: langCode,
                key: TEXTGEARS_API_KEY
            }
        });

        // Traitement de la réponse de l'API
        if (apiResponse.data && apiResponse.data.status) {
            const errors = apiResponse.data.response?.errors || [];

            // Construction de la réponse formatée
            let correctedText = text;
            const formattedErrors = [];

            // Traitement des erreurs et corrections
            errors.forEach(error => {
                const description = error.description?.en || 'Erreur grammaticale';

                formattedErrors.push({
                    message: description,
                    text: error.bad || '',
                    suggestions: error.better || []
                });

                // Application des corrections si disponibles
                if (error.bad && error.better && error.better.length > 0) {
                    // Remplacement du texte incorrect par la suggestion
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

// Endpoint pour corriger un texte complet
router.post('/correct', async (req, res) => {
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

        // Conversion du code de langue pour TextGears
        const langCode = 
            language === 'fr' ? 'fr-FR' : 
            language === 'en-US' ? 'en-US' :
            language === 'en-GB' ? 'en-GB' :
            language === 'en-ZA' ? 'en-ZA' :
            language === 'en-AU' ? 'en-AU' :
            language === 'en-NZ' ? 'en-NZ' :
            language === 'en' ? 'en-GB' :
            language === 'de-DE' ? 'de-DE' :
            language === 'de-AT' ? 'de-AT' :
            language === 'de-CH' ? 'de-CH' :
            language === 'de' ? 'de-DE' :
            language === 'pt-PT' ? 'pt-PT' :
            language === 'pt-BR' ? 'pt-BR' :
            language === 'it-IT' ? 'it-IT' :
            language === 'it' ? 'it-IT' :
            language === 'ar-AR' ? 'ar-AR' :
            language === 'ru-RU' ? 'ru-RU' :
            language === 'es-ES' ? 'es-ES' :
            language === 'es' ? 'es-ES' :
            language === 'ja-JP' ? 'ja-JP' :
            language === 'zh-CN' ? 'zh-CN' :
            language === 'el-GR' ? 'el-GR' : 'en-GB';

        // Appel à l'API TextGears pour la correction de texte
        const apiResponse = await axios.get('https://api.textgears.com/correct', {
            params: {
                text: text,
                language: langCode,
                key: TEXTGEARS_API_KEY
            }
        });

        // Traitement de la réponse de l'API
        if (apiResponse.data && apiResponse.data.status) {
            const correctedText = apiResponse.data.response?.corrected || text;

            // Création de la réponse
            const response = {
                original: text,
                corrected: correctedText,
                language: language,
                status: text !== correctedText ? 'corrected' : 'perfect'
            };

            return res.json(response);
        } else {
            throw new Error('Réponse invalide de l\'API TextGears');
        }

    } catch (error) {
        console.error('Erreur de correction de texte:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la correction de texte',
            details: error.message
        });
    }
});

module.exports = router;
