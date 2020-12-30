import firebase from "firebase/app";
import "firebase/auth";

// initialize firebase app

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "online-code-exercise.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: "online-code-exercise.appspot.com",
    messagingSenderId: "522789307318",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

export default firebase;
