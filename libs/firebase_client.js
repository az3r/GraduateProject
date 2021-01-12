import firebase from "firebase/app";
import { validate } from "email-validator";
import "firebase/auth";

// initialize firebase app for browser
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}
const FirebaseAuth = firebase.auth;

async function register({ username, email, password }) {
  if (validate(email)) {
    try {
      const auth = FirebaseAuth();
      const creds = await auth.createUserWithEmailAndPassword(email, password);
      await creds.user.updateProfile({
        displayName: username,
        photoURL: "./avatar.jpeg", // TODO: find a default avatar for new user
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    throw { error: "Email is invalid" };
  }
}

export default FirebaseAuth;
