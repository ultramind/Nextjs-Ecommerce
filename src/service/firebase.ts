import { FirebaseApp, initializeApp } from 'firebase/app';
import { Messaging, getMessaging, getToken, onMessage } from 'firebase/messaging';

export class FirebaseService {
  private firebaseApp: FirebaseApp;
  public messaging: Messaging;

  constructor() {
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    });
    this.firebaseApp = app;
    this.messaging = getMessaging(app);
  }

  messageListener() {
    onMessage(this.messaging, (payload) => {
      // console.log('Message received. ', payload);
      const title = payload.data?.sender as string;
      new Notification(title, {
        body: payload.data?.message,
        icon: "https://niteon.co/niteon.svg",
        image: "https://niteon.co/niteon.svg",
      })
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      return window.navigator.serviceWorker
        .getRegistration()
        .then(() => {
          // console.log({ serviceWorker });
          return window.navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          );
        });
    }
    throw new Error('The browser doesn`t support service worker.');
  }

  unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      return window.navigator.serviceWorker
        .getRegistration()
        .then((serviceWorker) => {
          if (serviceWorker) {
            return serviceWorker.unregister();
          }
        });
    }
    throw new Error('The browser doesn`t support service worker.');
  }

  async promptForNotificationPermission() {
    if (!('Notification' in window))
      return alert('This browser does not support push notification');
    if (Notification.permission === 'granted') {
      return window.navigator.serviceWorker
        .getRegistration()
        .then((serviceWorker) => {
          if (serviceWorker) {
            return this.getToken();
          }
        });
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return window.navigator.serviceWorker
        .getRegistration()
        .then((serviceWorker) => {
          if (serviceWorker) {
            return this.getToken();
          }
        });
    }
  }

  async getToken() {
    // const channelId = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    const token = await getToken(this.messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });

    return token;
  }
}