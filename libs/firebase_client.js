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
const FirebaseAuth = firebase.auth;
const Firestore = firebase.firestore;

async function register({ username, email, password }) {
  return FirebaseAuth()
    .createUserWithEmailAndPassword(email, password)
    .then(
      (credentials) =>
        // TODO: save username and email into database
        // update profile
        credentials.user
          .updateProfile({
            displayName: username,
          })
          .then(() => credentials)
          .catch((error) =>
            Promise.reject({
              error: 'update-profile-failed',
              message: "Failed to update user' profile",
              details: error,
            })
          ),
      (error) => ({
        error: 'invalid-account',
        message: 'Invalid email format or password is too weak',
        details: error,
      })
    );
}

async function signin({ username, password, provider }) {
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
  const result = await Firestore()
    .collection('User')
    .doc(username)
    .get()
    .then((snapshot) => {
      if (snapshot.exists)
        return {
          success: {
            email: snapshot.get('email'),
          },
        };
      return {
        failure: {
          error: 'firestore-error',
          message: 'Failed to get email from user',
          details: {},
        },
      };
    })
    .catch((error) => ({
      failure: {
        error: 'firestore-error',
        message: 'Failed to get email from user',
        details: error,
      },
    }));
  if (result.success) {
    return FirebaseAuth()
      .signInWithEmailAndPassword(result.success.email, password)
      .then((credentials) => credentials)
      .catch((error) =>
        Promise.reject({
          error: 'invalid-username-password',
          message: 'Email or password is incorrect',
          details: error,
        })
      );
  }
  return Promise.reject(result.failure);
}
async function signinWithProvider(provider) {
  // sign in using a provider
  return FirebaseAuth()
    .signInWithPopup(provider)
    .then((credentials) => credentials)
    .catch((error) =>
      Promise.reject({
        error: 'invalid-provider',
        message: 'The supplied AuthProvider is invalid',
        details: error,
      })
    );
}

export { FirebaseAuth, signin, register };
