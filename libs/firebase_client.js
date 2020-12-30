import firebase from "firebase/app";
import "firebase/auth";

// initialize firebase app
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "online-code-exercise.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: "online-code-exercise.appspot.com",
    messagingSenderId: "522789307318",
    appId: process.env.FIREBASE_PROJECT_APP_ID,
  });
}

export default firebase;
