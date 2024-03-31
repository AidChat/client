import {initializeApp} from "firebase/app";
import {getMessaging} from "firebase/messaging";

export function getFCMMessaging(){
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
  };
  const fapp = initializeApp(firebaseConfig);
  return getMessaging(fapp);
}



