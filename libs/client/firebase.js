import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyCReQZnej1675Dg71u3BG5bNEn10vrMdjA',
  authDomain: 'online-code-exercise.firebaseapp.com',
  projectId: 'online-code-exercise',
  storageBucket: 'online-code-exercise.appspot.com',
  messagingSenderId: '522789307318',
  appId: '1:522789307318:web:9afdbda5c00ea81654b717',
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

const Firestore = firebase.firestore;
const FirebaseAuth = firebase.auth;
const Storage = firebase.storage;

export { FirebaseAuth, Firestore, Storage };
