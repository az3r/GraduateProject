import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

const Firestore = firebase.firestore;

export const FirebaseAuth = firebase.auth;

export async function register({ username, email, password }) {
  return FirebaseAuth()
    .createUserWithEmailAndPassword(email, password)
    .then((credentials) =>
      Firestore()
        .collection('User')
        .doc(username)
        .set({
          email,
        })
        .then(() => credentials)
        .catch((error) =>
          Promise.reject({
            error: 'firestore-error',
            message: 'Unable to update email for user',
            details: {
              ...error,
              collection: 'User',
              doc: username,
              at: {
                email,
              },
            },
          })
        )
    )
    .catch((error) =>
      Promise.reject({
        error: 'invalid-account',
        message: 'Invalid email format or password is too weak',
        details: error,
      })
    );
}

export async function signin({ username, password, provider }) {
  if (username && password) {
    return signinWithUsername(username, password);
  }

  if (!provider) {
    return Promise.reject({
      error: 'missing-provider',
      message: 'An AuthProvider must be supplied',
      details: {},
    });
  }

  return signinWithProvider(provider);
}

async function signinWithUsername(username, password) {
  const email = await Firestore()
    .collection('User')
    .doc(username)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) return snapshot.get('email');
      return Promise.reject({
        error: 'invalid-username',
        message: 'username does not exist in database',
        details: { username },
      });
    })
    .catch((failure) => {
      if (failure.error === 'invalid-username') return Promise.reject(failure);
      return Promise.reject({
        error: 'firestore-error',
        message: 'Failed to get email from user',
        details: failure,
      });
    });

  return FirebaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => result)
    .catch((error) =>
      Promise.reject({
        error: 'invalid-password',
        message: 'Password is incorrect',
        details: error,
      })
    );
}

async function signinWithProvider(provider) {
  // sign in using a provider
  return FirebaseAuth()
    .signInWithPopup(provider)
    .then((credentials) => credentials)
    .catch((error) =>
      Promise.reject({
        error: 'signin-provider-error',
        message: 'Failed to signin with provider',
        details: error,
      })
    );
}
