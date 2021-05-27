import { collections } from '@utils/constants';
import { Firestore, FirebaseAuth } from './firebase';
import { find } from './users';

export async function register({ username, email, password, role }) {
  const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );

  await setupAccount({
    id: credentials.user.uid,
    email,
    password,
    role,
    username,
  });
  return credentials;
}

export async function signinWithPassword({ email, password }) {
  const credentials = await FirebaseAuth().signInWithEmailAndPassword(
    email,
    password
  );
  const user = find(credentials.user.uid);
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
  const ref = Firestore().collection(collection).doc(id);
  await ref.set({
    id,
    name: username,
    email,
    role,
    avatar: avatar || 'https://picsum.photos/200',
    createdOn: Firestore.Timestamp.now(),
  });

  // user's private attributes
  await ref
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ parent: id });
}
