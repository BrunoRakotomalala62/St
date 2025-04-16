function addMessage(content, isUser = false) {
  const chatMessages = document.querySelector('.chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');

  if (content instanceof File) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(content);
    img.style.maxWidth = '300px';
    img.style.borderRadius = '10px';
    messageDiv.appendChild(img);
  } else {
    // Handle markdown-style lists
    const formattedContent = content.split('\n').map(line => {
      if (line.match(/^\d+\./)) {
        return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
      }
      return line;
    }).join('\n');

    messageDiv.innerHTML = formattedContent;
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSendMessage() {
  const messageInput = document.getElementById('message-input');
  const fileInput = document.getElementById('file-upload');
  const message = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!message && !file) return;

  if (file) {
    addMessage(file, true);
  }
  if (message) {
    addMessage(message, true);
  }
  messageInput.value = '';

  if (file) {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('message', message || '');

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      addMessage(data.response);
    } catch (error) {
      console.error('Error:', error);
      addMessage('Désolé, une erreur s\'est produite.');
    }

    fileInput.value = '';
  } else {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      addMessage(data.response);
    } catch (error) {
      console.error('Error:', error);
      addMessage('Désolé, une erreur s\'est produite.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const homeBtn = document.querySelector('.home-btn');
    const exercisesBtn = document.querySelector('.exercises-btn');
    const bacc = document.querySelector('.bacc-btn');
    const contact = document.querySelector('.contact-btn');
    const translation = document.querySelector('.translation-btn');
    const cours = document.querySelector('.courses-btn');
    const fichier = document.querySelector('.pdf-btn');
    const educmad = document.querySelector('.educmad-btn');
    const calendar = document.querySelector('.calendar-btn');
    const autres = document.querySelector('.autres-btn');
    const chatbot = document.querySelector('.chatbot-btn');

    // Event listeners for navigation
    if (homeBtn) homeBtn.addEventListener('click', () => window.location.href = '/');
    if (exercisesBtn) exercisesBtn.addEventListener('click', () => window.location.href = '/exercices');
    if (bacc) bacc.addEventListener('click', () => window.location.href = '/sujet');
    if (contact) contact.addEventListener('click', () => window.location.href = '/contact');
    if (translation) translation.addEventListener('click', () => window.location.href = '/translate');
    if (cours) cours.addEventListener('click', () => window.location.href = '/cours');
    if (fichier) fichier.addEventListener('click', () => window.location.href = '/fichierPdf');
    if (educmad) educmad.addEventListener('click', () => window.location.href = '/educmad');
    if (calendar) calendar.addEventListener('click', () => window.location.href = '/calendar');
    if (autres) autres.addEventListener('click', () => window.location.href = '/autres');
    if (chatbot) chatbot.addEventListener('click', () => window.location.href = '/Chatbot/chatbot');
    
    // Gestionnaire pour le nouveau chemin Chatbot
    const chatbotNewPath = document.querySelector('.chatbot-new-path');
    if (chatbotNewPath) chatbotNewPath.addEventListener('click', () => window.location.href = '/Chatbot/chatbot');

  const sendButton = document.querySelector('.send-message');
  const messageInput = document.getElementById('message-input');
  const clearButton = document.querySelector('.clear-chat');

  // Gérer le clic sur le bouton effacer
  clearButton?.addEventListener('click', async () => {
    try {
      // Effacer les messages affichés
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.innerHTML = '';

      // Réinitialiser la conversation côté serveur
      const response = await fetch('/chat/reset', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation');
      }

    } catch (error) {
      console.error('Erreur:', error);
      addMessage('Désolé, une erreur s\'est produite lors de la réinitialisation.');
    }
  });

  // Handle send button click
  sendButton?.addEventListener('click', handleSendMessage);

  // Handle enter key
  messageInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  const themeToggle = document.querySelector('.theme-toggle');
  let isDark = localStorage.getItem('theme') === 'dark';

  // Appliquer le thème au chargement
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌓';

  themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌓';
  });

  // Ajout d'animation sur les boutons
  // Gérer le clic sur le bouton horoscope dans autres.html
    document.querySelector('.horoscope-btn')?.addEventListener('click', () => {
        window.location.href = '/horoscope';
    });

    document.querySelector('.kabary-btn')?.addEventListener('click', () => {
        window.location.href = '/autres/Kabary/kabary.html';
    });

    document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 100);

      if (button.classList.contains('contact-btn')) {
        window.location.href = '/contact';
      } else if (button.classList.contains('courses-btn')) {
        window.location.href = '/cours';
      } else if (button.classList.contains('bacc-btn')) {
        window.location.href = '/sujet';
      } else if (button.classList.contains('chatbot-btn')) {
        window.location.href = '/chatbot';
      } else if (button.classList.contains('pdf-btn')) {
        window.location.href = '/fichierPdf';
      } else if (button.classList.contains('calendar-btn')) {
        window.location.href = '/calendar';
      } else if (button.classList.contains('autres-btn')) {
        window.location.href = '/autres';
      } else if (button.classList.contains('educmad-btn')) {
        window.location.href = '/educmad';
      }
    });
  });


// Effet de vagues audio sur les messages du chatbot
function addWaveEffect() {
  const botMessages = document.querySelectorAll('.bot-message');
  botMessages.forEach(message => {
    // Créer un élément pour l'effet de vague
    const waveEffect = document.createElement('div');
    waveEffect.classList.add('wave-effect');

    // Ajouter l'effet si pas déjà présent
    if (!message.querySelector('.wave-effect')) {
      message.style.position = 'relative';
      message.style.overflow = 'hidden';
      message.appendChild(waveEffect);
    }
  });
}

// Observer pour les nouveaux messages
function observeNewMessages() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        addWaveEffect();
      }
    });
  });

  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    observer.observe(chatMessages, { childList: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  observeNewMessages();

  // Ajouter des particules lorsqu'on clique sur le bouton d'envoi
  const sendButton = document.querySelector('.send-message');
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      createParticleEffect(sendButton);
    });
  }
});

// Effet de particules lors de l'envoi d'un message
function createParticleEffect(element) {
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.background = `hsl(${Math.random() * 120 + 100}, 100%, 60%)`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = '0 0 10px 2px currentColor';

    // Position initiale
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Animation
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 100 + 50;
    const opacity = Math.random() * 0.5 + 0.5;

    particle.style.transition = 'all 0.5s ease-out';
    particle.style.opacity = opacity;

    document.body.appendChild(particle);

    // Déplacer la particule
    setTimeout(() => {
      particle.style.transform = `translate(${Math.cos(angle) * speed}px, ${Math.sin(angle) * speed}px)`;
      particle.style.opacity = '0';
    }, 10);

    // Supprimer la particule
    setTimeout(() => {
      document.body.removeChild(particle);
    }, 500);
  }
}
});