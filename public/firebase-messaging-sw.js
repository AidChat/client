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

// commented because of a bug due to which the notification is triggering twice
messaging.onBackgroundMessage(payload => {
  const notificationTitle = "Aidchat";
  const notificationOptions = {
    body: payload.data.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
