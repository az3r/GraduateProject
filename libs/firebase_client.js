import firebase from 'firebase/app';
import 'firebase/auth';

class ErrorSignin {
  constructor({ error, message, details }) {
    this.error = error || 'unknown-error';
    this.message = message || 'Empty message';
    this.details = details || {};
  }

  static reject({ error, message, details }) {
    return Promise.reject(new ErrorSignin({ error, message, details }));
  }
}

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
  return FirebaseAuth()
    .createUserWithEmailAndPassword(email, password)
    .then(
      (credentials) => {
        // TODO: save username and email into database
        // update profile
        credentials.user
          .updateProfile({
            displayName: username,
          })
          .then(() => credentials)
          .catch((error) =>
            ErrorSignin.reject({
              error: 'update-profile-failed',
              message: "Failed to update user' profile",
              details: error,
            })
          );
      },
      (error) => ({
        error: 'invalid-account',
        message: 'Invalid email format or password is too weak',
        details: error,
      })
    );
}

async function signin({ username, password, provider }) {
  if (username && password) {
    // TODO: retrieve token from api
    // const token = getToken(username, password);
    const token = 'sfsjflksjflsfse';
    return FirebaseAuth()
      .signInWithCustomToken(token)
      .then((credentials) => credentials)
      .catch((error) =>
        ErrorSignin.reject({
          error: 'invalid-username-password',
          message: 'Email or password is incorrect',
          details: error,
        })
      );
  }
  if (!provider) {
    return ErrorSignin.reject({
      error: 'missing-provider',
      message: 'An AuthProvider must be supplied',
      details: {},
    });
  }

  // sign in using a provider
  return FirebaseAuth()
    .signInWithPopup(provider)
    .then((credentials) => credentials)
    .catch((error) =>
      ErrorSignin.reject({
        error: 'invalid-provider',
        message: 'The supplied AuthProvider is invalid',
        details: error,
      })
    );
}

export { FirebaseAuth, signin, register };
