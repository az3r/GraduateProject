import { collections } from '@utils/constants';
import { getEmailByName } from '@client/users';
import { Firestore, FirebaseAuth } from './firebase';

export async function register({ username, email, password, role }) {
  const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );

  await setupAccount(credentials.user, username, role);
  return credentials;
}

export async function registerWithProvider({ provider, role }) {
  const credentials = await FirebaseAuth().signInWithPopup(provider);
  const { displayName } = credentials.user;
  await setupAccount(credentials.user, displayName, role);
  return credentials;
}

export async function signinWithProvider({ provider }) {
  return FirebaseAuth().signInWithPopup(provider);
}

export async function signin({ username, password }) {
  const email = await getEmailByName(username);
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

export async function setupAccount(user, username, role) {
  const { email, uid } = user;
  // update profile
  const avatar = 'https://picsum.photos/200';
  await user.updateProfile({
    displayName: username,
    photoURL: avatar,
  });

  // create user document
  const collection =
    role === 'developer' ? collections.developers : collections.companies;
  const ref = Firestore().collection(collection).doc(uid);
  await ref.set({
    id: uid,
    name: username,
    email,
    role,
    avatar,
  });

  // user's private attributes
  await ref
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ id: uid });
}
