importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
const firebaseConfig = {
  apiKey: "AIzaSyBcVkphaF8Pprb9pasqzY4EDSKEn76OCDA",

  authDomain: "react-cart-f7ebd.firebaseapp.com",

  projectId: "react-cart-f7ebd",

  storageBucket: "react-cart-f7ebd.appspot.com",

  messagingSenderId: "394483049495",

  appId: "1:394483049495:web:56b4f47824feb0db8aa852",

  measurementId: "G-ZRJCL1NPYY",
};

const fb = firebase.initializeApp(firebaseConfig);

const messaging = fb.messaging();
const CACHE_NAME = "aidchat-cache-v1";
// commented because of a bug due to which the notification is triggering twice
messaging.onBackgroundMessage(payload => {
  const notificationTitle = "Aidchat";
  const notificationOptions = {
    body: payload.data.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(["*"]);
    })
  );
});

self.addEventListener("fetch", event => {
  if (
    event.request.url.startsWith("ws://") ||
    event.request.url.startsWith("wss://")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener("activate", event => {
  const cacheWhitelist = ["aidchat-cache-v1"];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
