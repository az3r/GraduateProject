import { collections } from '@utils/constants';
import { getAttributeReference } from '@utils/firestore';
import { Firestore, FirebaseAuth } from './firebase';
import { find } from './users';

export async function register({ username, email, password, role }) {
  const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );

  return setupAccount({
    id: credentials.user.uid,
    email,
    password,
    role,
    username,
  });
}

export async function signinWithPassword({ email, password }) {
  const credentials = await FirebaseAuth().signInWithEmailAndPassword(
    email,
    password
  );
  const user = await find(credentials.user.uid);
  if (user) return user;
  credentials.user.delete();
  return Promise.reject({ code: 'auth/user-not-found' });
}

export async function sendVerifyEmail(user, url) {
  return user.sendEmailVerification({
    url,
  });
}

export async function signout() {
  return FirebaseAuth().signOut();
}

export async function setupAccount({ id, username, avatar, email, role }) {
  // create user document
  const collection =
    role === 'developer' ? collections.developers : collections.companies;

  const batch = Firestore().batch();

  // user's private attributes
  const attribute = getAttributeReference(collection, id);
  batch.set(attribute, { parent: id });

  // user's public attributes
  const developer = Firestore().collection(collection).doc(id);
  batch.set(developer, {
    id,
    name: username,
    email,
    role,
    avatar: avatar || 'https://picsum.photos/64',
    createdOn: Firestore.Timestamp.now(),
  });

  await batch.commit();

  return {
    id,
    name: username,
    email,
    role,
    avatar: avatar || 'https://picsum.photos/64',
    createdOn: Firestore.Timestamp.now(),
  };
}
