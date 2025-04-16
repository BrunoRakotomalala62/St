const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

// Activer CORS pour toutes les requêtes
app.use(cors());
const gemini = require('./pilot/gemini');
const horoscopeRouter = require('./pilot/horoscope');
const tempmailRouter = require('./pilot/tempmail');
const quizRouter = require('./pilot/quiz');
const ohabolanaRouter = require('./pilot/ohabolana');
const translationRouter = require('./pilot/translation');
const tononkiraRouter = require('./pilot/tononkira');
const grammarRouter = require('./pilot/grammar'); // Added grammar route
const ai21Router = require('./pilot/ai21'); // Added AI21 route

app.use('/api/horoscope', horoscopeRouter);
app.use('/api/tempmail', tempmailRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/ohabolana', ohabolanaRouter);
app.use('/api/translation', translationRouter);
app.use('/api/tononkira', tononkiraRouter);
app.use('/api/grammar', grammarRouter); // Added grammar route
app.use('/api/ai21', ai21Router); // Added AI21 route
const handleChat = gemini.handleChat;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.static('public'));
app.use(express.json());
app.use('/Attachement', express.static('Attachement'));

app.post('/chat', upload.array('files'), async (req, res) => {
  try {
    const message = req.body.message || '';
    const files = req.files || [];

    const response = await handleChat(message, files);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/translate', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'translate/translation.html'));
});

app.get('/educmad', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'educmad/educmad.html'));
});

app.get('/cours', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/cours.html'));
});

app.get('/cours/serieA', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieA/Cours_serie_A.html'));
});

app.get('/cours/serieA/malagasy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieA/cours_Malagasy_SerieA.html'));
});

app.get('/cours/serieC', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/Cours_serie_C.html'));
});

app.get('/cours/serieD/Cours_serie_D.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieD/Cours_serie_D.html'));
});

app.get('/cours/serieL/Cours_serie_L.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieL/Cours_serie_L.html'));
});

app.get('/cours/serieOSE/Cours_serie_OSE.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieOSE/Cours_serie_OSE.html'));
});

app.get('/cours/serieC/malagasy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/cours_Malagasy_SerieC.html'));
});

app.get('/cours/serieC/philosophie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/cours_Philosophie_SerieC.html'));
});

app.get('/cours/serieC/histoire-geographie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/cours_Histoire_Geo_SerieC.html'));
});

app.get('/cours/serieC/francais', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/cours_Francais_SerieC.html'));
});

app.get('/cours/serieC/anglais', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/serieC/cours_Anglais_SerieC.html'));
});

app.get('/cours/malagasy5eme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours', 'malagasy5eme', 'malagasy5eme.html'));
});

app.get('/cours/malagasy6eme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours', 'malagasy6eme', 'malagasy6eme.html'));
});

app.get('/cours/3eme/physique', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours/3eme/coursPhysique3eme.html'));
});

app.get('/cours/malagasy3eme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours', 'malagasy3eme', 'malagasy3eme.html'));
});

app.get('/cours/malagasy4eme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cours', 'malagasy4eme', 'malagasy4eme.html'));
});

app.get('/exercices/exercice/baccBlanc.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/baccBlanc.html'));
});

app.get('/exercices/exercice/baccblanc/mathematiques.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/baccblanc/mathematiques.html'));
});

app.get('/exercices/exercice/baccblanc/physique.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/baccblanc/physique.html'));
});

app.get('/exercices/exercice/baccblanc/physique2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/baccblanc/physique2.html'));
});

app.get('/exercices/exercice/baccblanc/mathematiques2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/baccblanc/mathematiques2.html'));
});

app.get('/exercices/exercice/bepcBlanc.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/bepcBlanc.html'));
});

app.get('/exercices/exercice/bepcBlanc/physique.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/bepcBlanc/physique.html'));
});


app.get('/sujet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sujet.html'));
});

app.get('/chatbot', (req, res) => {
  res.redirect('/Chatbot/chatbot');
});

app.get('/Chatbot/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Chatbot', 'chatbot.html'));
});

// Redirection de l'ancienne URL vers la nouvelle si nécessaire
app.get('/Chatbot', (req, res) => {
  res.redirect('/Chatbot/chatbot');
});

app.get('/exercices', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice.html'));
});

app.get('/exercices/exercice/examen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercices/exercice/examen.html'));
});

app.get('/fichierPdf', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fichierPdf.html'));
});

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calendar.html'));
});

app.get('/autres', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/autres.html'));
});

app.get('/horoscope', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/horoscope.html'));
});

app.get('/autres/tempmail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tempmail.html'));
});

app.get('/autres/tempmail/generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tempmail/generator.html'));
});

app.get('/autres/tempmail/message', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tempmail/message.html'));
});

app.get('/autres/Kabary/kabary.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/Kabary/kabary.html'));
});

app.get('/autres/ohabolana/ohabolana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/ohabolana/ohabolana.html'));
});

app.get('/autres/raccourci/raccourci.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/raccourci/raccourci.html'));
});

app.get('/autres/tononkira/tononkira.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tononkira/tononkira.html'));
});

app.get('/autres/tononkira/lohateny.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tononkira/lohateny.html'));
});

app.get('/autres/tononkira/titre.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tononkira/titre.html'));
});

app.get('/autres/tononkira/titre/page.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tononkira/titre/page.html'));
});

app.get('/autres/tononkira/song.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/tononkira/song.html'));
});

app.get('/autres/kabary/ALA_SARONA/ala_sarona.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/ALA_SARONA/ala_sarona.html'));
});

app.get('/autres/kabary/fanambadiana/fanambadiana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/fanambadiana/fanambadiana.html'));
});

app.get('/autres/kabary/dontany/dontany.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/dontany/dontany.html'));
});

app.get('/autres/kabary/famadihana/famadihana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/famadihana/famadihana.html'));
});

app.get('/autres/kabary/famangiana/famangiana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/famangiana/famangiana.html'));
});

app.get('/autres/kabary/fandevenana/fandevenana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/fandevenana/fandevenana.html'));
});

app.get('/autres/kabary/fanasana/fanasana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/fanasana/fanasana.html'));
});

app.get('/autres/kabary/jobily/jobily.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/kabary/jobily/jobily.html'));
});

app.get('/horoscope/dynamique.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autres/horoscope/dynamique.html'));
});

app.get('/sujetAmpinga', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sujetAmpinga.html'));
});

app.post('/chat/reset', (req, res) => {
  try {
    // Réinitialiser la conversation
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting chat:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite' });
  }
});

app.get('/physiqueTA', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'physiqueTA.html'));
});

app.get('/pdfPCTA', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pdfPCTA.html'));
});

app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ai.html'));
}); // Added route for ai.html

app.get('/ai21', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'selectionner', 'ai', 'ai21.html'));
}); // Added route for ai21.html

// Import du module AI21
const ai21Module = require('./pilot/ai21');

// Route pour l'API AI21
app.get('/api/ai21', async (req, res) => {
  try {
    const { prompt, uid } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Le prompt est requis' });
    }
    
    // Utiliser le module AI21 pour obtenir une réponse
    const response = await ai21Module.getAI21Response(prompt, uid);
    
    // Renvoyer la réponse au client
    res.json(response);
    
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API AI21:', error);
    res.status(500).json({ 
      error: 'Une erreur s\'est produite lors de la communication avec l\'API AI21',
      message: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer plus tard.'
    });
  }
});

// Route directe pour l'API AI21 (pour les tests)
app.get('/api/ai21/test', async (req, res) => {
  try {
    const { prompt, uid } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Le prompt est requis' });
    }
    
    // ID de conversation (utiliser celui fourni ou en générer un nouveau)
    const conversationId = uid || Date.now().toString();
    
    // Appel à l'API AI21
    const response = await axios.post(`https://ai21.vercel.app/ai21`, {
      prompt: prompt,
      uid: conversationId
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});