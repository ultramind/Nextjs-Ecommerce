// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBDF12xkgCeXZo6Jj8g2pTK29f8pz1R7Gk",
  authDomain: "niteon-market.firebaseapp.com",
  projectId: "niteon-market",
  storageBucket: "niteon-market.appspot.com",
  messagingSenderId: "235996786932",
  appId: "1:235996786932:web:e68707932bed0f3262aea1",
  measurementId: "G-XBLNSGTMEW"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

//background
messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    icon: "https://niteon.co/niteon.svg",
    badge: "https://niteon.co/niteon.svg",
    body: payload.notification.body,
    data: payload.data,
    renotify: false,
    vibrate: [100, 50, 100],
    tag: "niteon-notification",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
