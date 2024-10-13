import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Gerenciamento da instalação do PWA
let deferredPrompt;
const installButton = document.getElementById('installButton');
const enableNotificationsButton = document.getElementById('enableNotificationsButton');

// Evento para detectar quando o prompt de instalação do PWA pode ser exibido
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA');
      } else {
        console.log('Usuário recusou a instalação do PWA');
      }
      deferredPrompt = null;
    });
  });
});

// Solicitação de permissão para notificações push
enableNotificationsButton.addEventListener('click', () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notificação permitida!');

      // Obtém o token de registro
      getToken(messaging, { vapidKey: 'SUA_VAPID_KEY' })
        .then((currentToken) => {
          if (currentToken) {
            console.log('Token de registro: ', currentToken);
            // Enviar token para o backend para enviar notificações push
          } else {
            console.log('Nenhum token de registro disponível.');
          }
        })
        .catch((err) => {
          console.error('Erro ao obter token: ', err);
        });

      // Escutar mensagens recebidas quando o app estiver em primeiro plano
      onMessage(messaging, (payload) => {
        console.log('Mensagem recebida: ', payload);
        // Exibir notificação personalizada
      });
    } else {
      console.log('Permissão de notificação negada.');
    }
  });
});
