import firebase from "firebase/app";
import "firebase/auth";

// initialize firebase app
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyCReQZnej1675Dg71u3BG5bNEn10vrMdjA",
    authDomain: "online-code-exercise.firebaseapp.com",
    projectId: "online-code-exercise",
    storageBucket: "online-code-exercise.appspot.com",
    messagingSenderId: "522789307318",
    appId: "1:522789307318:web:9afdbda5c00ea81654b717",
  });
}

export default firebase;
