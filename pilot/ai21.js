
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

        console.log(`Requête reçue avec prompt: "${prompt}" et uid: ${conversationId}`);

        // Format de réponse prédéfini pour tester
        const responses = {
            "bonsoir": "Bonsoir! Comment puis-je vous aider ce soir ?",
            "qui es-tu?": "Je suis Jamba, un assistant virtuel basé sur l'intelligence artificielle, conçu pour aider à résoudre des problèmes, répondre à des questions et fournir des informations utiles de manière précise et efficace. Je peux aider dans divers domaines tels que la programmation, la rédaction, la recherche, et bien plus encore. N'hésitez pas à me poser vos questions ou à me demander de l'aide dans vos projets !",
            "bonjour": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            "salut": "Salut ! Que puis-je faire pour vous ?",
            "merci": "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
            "au revoir": "Au revoir ! Passez une excellente journée !"
        };

        // Vérifier si nous avons une réponse prédéfinie pour ce prompt
        let message = responses[prompt.toLowerCase()];
        
        // Si pas de réponse prédéfinie, essayer d'appeler l'API externe
        if (!message) {
            try {
                const externalResponse = await axios({
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
                    timeout: 30000 // Timeout après 30 secondes
                });
                
                if (externalResponse.data && externalResponse.data.message) {
                    message = externalResponse.data.message;
                } else {
                    message = "Je ne suis pas sûr de comprendre votre demande. Pourriez-vous reformuler?";
                }
            } catch (apiError) {
                console.error("Erreur API externe:", apiError.message);
                message = "Je suis désolé, mais je ne peux pas traiter votre demande pour le moment. Pourriez-vous essayer à nouveau plus tard?";
            }
        }

        // Renvoyer la réponse au client
        res.json({
            message: message,
            conversation_id: conversationId,
            message_count: 2 // Simuler un compteur de messages
        });

    } catch (error) {
        console.error('Erreur lors du traitement de la requête:', error);

        // Réponse d'erreur plus conviviale pour l'utilisateur
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors du traitement de votre demande',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.',
            details: error.message
        });
    }
});

// Route POST pour traiter les requêtes AI21 - même logique que GET
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

        console.log(`Requête POST reçue avec prompt: "${prompt}" et uid: ${conversationId}`);

        // Format de réponse prédéfini pour tester
        const responses = {
            "bonsoir": "Bonsoir! Comment puis-je vous aider ce soir ?",
            "qui es-tu?": "Je suis Jamba, un assistant virtuel basé sur l'intelligence artificielle, conçu pour aider à résoudre des problèmes, répondre à des questions et fournir des informations utiles de manière précise et efficace. Je peux aider dans divers domaines tels que la programmation, la rédaction, la recherche, et bien plus encore. N'hésitez pas à me poser vos questions ou à me demander de l'aide dans vos projets !",
            "bonjour": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            "salut": "Salut ! Que puis-je faire pour vous ?",
            "merci": "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
            "au revoir": "Au revoir ! Passez une excellente journée !"
        };

        // Vérifier si nous avons une réponse prédéfinie pour ce prompt
        let message = responses[prompt.toLowerCase()];
        
        // Si pas de réponse prédéfinie, essayer d'appeler l'API externe
        if (!message) {
            try {
                const externalResponse = await axios({
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
                    timeout: 30000 // Timeout après 30 secondes
                });
                
                if (externalResponse.data && externalResponse.data.message) {
                    message = externalResponse.data.message;
                } else {
                    message = "Je ne suis pas sûr de comprendre votre demande. Pourriez-vous reformuler?";
                }
            } catch (apiError) {
                console.error("Erreur API externe:", apiError.message);
                message = "Je suis désolé, mais je ne peux pas traiter votre demande pour le moment. Pourriez-vous essayer à nouveau plus tard?";
            }
        }

        // Renvoyer la réponse au client
        res.json({
            message: message,
            conversation_id: conversationId,
            message_count: 2 // Simuler un compteur de messages
        });

    } catch (error) {
        console.error('Erreur lors du traitement de la requête POST:', error);

        // Réponse d'erreur plus conviviale pour l'utilisateur
        res.status(500).json({ 
            error: 'Une erreur s\'est produite lors du traitement de votre demande',
            message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.',
            details: error.message
        });
    }
});

module.exports = router;
