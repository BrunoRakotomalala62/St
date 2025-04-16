const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configuration du middleware pour parser JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route GET pour traiter les requêtes AI21
router.get('/ai21', async (req, res) => {
    try {
        const { prompt, uid } = req.query;

        if (!prompt) {
            return res.status(400).json({ 
                error: 'Le prompt est requis',
                message: 'Veuillez fournir un message à envoyer au chatbot.'
            });
        }

        // ID de conversation (utiliser celui fourni ou en générer un nouveau)
        const conversationId = uid || Date.now().toString();

        console.log(`Envoi de la requête à AI21 avec prompt: "${prompt}" et uid: ${conversationId}`);

        // Appel direct à l'API AI21 avec les bons paramètres
        const response = await axios({
            method: 'get',
            url: 'https://ai21.vercel.app/ai21',
            params: {
                prompt: prompt,
                uid: conversationId
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 10000 // Timeout après 10 secondes
        });

        console.log('Réponse reçue de l\'API AI21:', response.data);

        // Renvoyer la réponse au client
        res.json(response.data);

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API AI21:', error);

        // Afficher plus de détails sur l'erreur pour le débogage
        if (error.response) {
            // La requête a été effectuée et le serveur a répondu avec un code d'état en dehors de la plage 2xx
            console.error('Données d\'erreur:', error.response.data);
            console.error('Status d\'erreur:', error.response.status);
            console.error('Headers d\'erreur:', error.response.headers);
        } else if (error.request) {
            // La requête a été effectuée mais aucune réponse n'a été reçue
            console.error('Requête sans réponse:', error.request);
        } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Erreur de configuration:', error.message);
        }

        // Réponse d'erreur plus conviviale pour l'utilisateur
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.',
            details: error.message
        });
    }
});

// Route POST pour traiter les requêtes AI21
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
        const response = await axios.get('https://ai21.vercel.app/ai21', {
            params: {
                prompt: prompt,
                uid: conversationId
            }
        });

        console.log('Réponse reçue de l\'API AI21:', response.data);

        // Renvoyer la réponse au client
        res.json(response.data);

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API AI21:', error);

        // Afficher plus de détails sur l'erreur pour le débogage
        if (error.response) {
            // La requête a été effectuée et le serveur a répondu avec un code d'état en dehors de la plage 2xx
            console.error('Données d\'erreur:', error.response.data);
            console.error('Status d\'erreur:', error.response.status);
            console.error('Headers d\'erreur:', error.response.headers);
        } else if (error.request) {
            // La requête a été effectuée mais aucune réponse n'a été reçue
            console.error('Requête sans réponse:', error.request);
        } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Erreur de configuration:', error.message);
        }

        // Réponse d'erreur plus conviviale pour l'utilisateur
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.',
            details: error.message
        });
    }
});

module.exports = router;