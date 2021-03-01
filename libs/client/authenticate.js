import { Firestore, FirebaseAuth } from './firebase_client';

export async function register({ username, email, password, role }) {
  try {
    const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
      email,
      password
    );
    await Firestore()
      .collection('Users')
      .doc(username)
      .set({
        email,
        role: role || 'developer',
      });
    return credentials;
  } catch (failure) {
    // TODO: catch firebase code
    return Promise.reject({
      error: 'invalid-account',
      message: 'Invalid email format or password is too weak',
      details: failure,
    });
  }
}

export async function existed({ username, email }) {
  try {
    if (username) {
      const snapshot = await Firestore().collection('User').doc(username).get();
      return snapshot.exists;
    }
    if (email) {
      const providers = await FirebaseAuth().fetchSignInMethodsForEmail(email);
      return providers.length > 0;
    }
    return false;
  } catch (error) {
    return Promise.reject({
      error: 'firestore-error',
      message: 'Unable to read document for collection "User"',
      details: error,
    });
  }
}

export async function sendVerifyEmail(url) {
  return FirebaseAuth().currentUser.sendEmailVerification({
    url,
  });
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

export async function signout() {
  return FirebaseAuth().signOut();
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
