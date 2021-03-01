import { Firestore, FirebaseAuth } from './firebase_client';

export async function register({ username, email, password, role }) {
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

  await credentials.user.updateProfile({
    displayName: username,
    photoURL: 'https://picsum.photos/200',
  });
  return credentials;
}

export async function existed({ username, email }) {
  if (username) {
    const snapshot = await Firestore().collection('User').doc(username).get();
    return snapshot.exists;
  }
  if (email) {
    const providers = await FirebaseAuth().fetchSignInMethodsForEmail(email);
    return providers.length > 0;
  }
  return false;
}

export async function sendVerifyEmail(url) {
  return FirebaseAuth().currentUser.sendEmailVerification({
    url,
  });
}

export async function signin({ username, password, provider }) {
  if (username && password) {
    const email = await Firestore().collection('User').doc(username).get();
    return FirebaseAuth().signInWithEmailAndPassword(email, password);
  }

  if (!provider) {
    return Promise.reject({
      code: 'custom/missing-provider',
      message: 'provider argument is null or undefined',
    });
  }

  return FirebaseAuth().signInWithPopup(provider);
}

export async function signout() {
  return FirebaseAuth().signOut();
}
