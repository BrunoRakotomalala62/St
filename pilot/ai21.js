
const axios = require('axios');

/**
 * Module pour communiquer avec l'API AI21
 * Ce module permet d'envoyer des requêtes à l'API AI21 et de récupérer les réponses
 */

// Fonction pour obtenir une réponse de l'API AI21
async function getAI21Response(prompt, uid) {
  try {
    // Vérification des paramètres
    if (!prompt) {
      throw new Error('Le prompt est requis');
    }

    // Utiliser l'ID de conversation fourni ou en générer un nouveau
    const conversationId = uid || Date.now().toString();
    
    // Appel à l'API AI21
    const response = await axios.get(`https://ai21.vercel.app/ai21`, {
      params: {
        prompt: prompt,
        uid: conversationId
      }
    });
    
    // Retourner la réponse
    return response.data;
    
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API AI21:', error);
    
    // Retourner une erreur formatée
    return { 
      error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
      message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.'
    };
  }
}

// Exporter les fonctions
module.exports = {
  getAI21Response
};
