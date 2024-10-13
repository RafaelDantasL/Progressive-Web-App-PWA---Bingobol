importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Recebe notificações em segundo plano
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
