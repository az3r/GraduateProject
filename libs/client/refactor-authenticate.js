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
  const ref = Firestore().collection(collection).doc(uid);
  await ref.set({
    id: uid,
    name: username,
    email,
    role,
    avatar: credentials.user.photoURL,
  });

  // user's private attributes
  await ref
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ id: uid });
}
