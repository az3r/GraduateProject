import { collections } from '@utils/constants';
import { Firestore, FirebaseAuth } from './firebase';

export async function register({ username, email, password, role }) {
  const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );

  return setupAccount(credentials, username, email, role);
}

export async function registerWithProvider({ provider, role }) {
  const credentials = await FirebaseAuth().signInWithPopup(provider);
  const { displayName: username, email } = credentials.user;
  return setupAccount(credentials, username, email, role);
}

export async function signinWithProvider({ provider }) {
  return FirebaseAuth().signInWithPopup(provider);
}

export async function signin({ email, password }) {
  return FirebaseAuth().signInWithEmailAndPassword(email, password);
}

export async function sendVerifyEmail(user, url) {
  return user.sendEmailVerification({
    url,
  });
}

export async function signout() {
  return FirebaseAuth().signOut();
}

async function setupAccount(credentials, username, email, role) {
  // update profile
  // const avatar = 'https://picsum.photos/200';
  await credentials.user.updateProfile({
    displayName: username,
    // photoURL: avatar,
  });

  // create user document
  const { uid } = credentials.user;
  const collection =
    role === 'developer' ? collections.developers : collections.companies;
  await Firestore().collection(collection).doc(uid).set({
    id: uid,
    name: username,
    email,
    avatar: credentials.user.photoURL,
  });

  // add new account to registered accounts
  await Firestore().collection(collections.accounts).doc(uid).set({
    id: uid,
    name: username,
    email,
    avatar: credentials.user.photoURL,
    role,
  });

  return credentials;
}
