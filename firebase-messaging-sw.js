importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyB4XSOOTIxbJvIpfd96MsyJZDW2aNi_uPc",
  authDomain: "loto-hack.firebaseapp.com",
  projectId: "loto-hack",
  storageBucket: "loto-hack.appspot.com",
  messagingSenderId: "138353732568",
  appId: "1:138353732568:web:71f27a582f25cd544aa0ad",
  measurementId: "G-P53RKCKPQ5"
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
