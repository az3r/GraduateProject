import firebase from "firebase";
import firebaseui from "firebaseui";

// initialize firebase app
const app = firebase.initializeApp({
  apiKey: "AIzaSyCReQZnej1675Dg71u3BG5bNEn10vrMdjA",
  authDomain: "online-code-exercise.firebaseapp.com",
  projectId: "online-code-exercise",
  storageBucket: "online-code-exercise.appspot.com",
  messagingSenderId: "522789307318",
  appId: "1:522789307318:web:9afdbda5c00ea81654b717",
});

export default app;

// initialize prebuilt firebase ui
exports.firebaseui = firebaseui.auth.AuthUI(firebase.auth());
