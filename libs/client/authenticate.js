import { collections } from '@utils/constants';
import { Firestore, FirebaseAuth } from './firebase';

export async function register({ username, email, password, role }) {
  const credentials = await FirebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );

  const avatar = 'https://picsum.photos/200';
  await Firestore()
    .collection('Users')
    .doc(credentials.user.uid)
    .set({
      name: username,
      email,
      avatar,
      role: role || 'developer',
    });

  await credentials.user.updateProfile({
    displayName: username,
    photoURL: avatar,
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
    const results = await Firestore()
      .collection(collections.users)
      .where('name', '==', username)
      .limit(1)
      .get();
    if (results.empty) throw new Error({ code: 'auth/user_not_found' });
    const { email } = results[0];
    return FirebaseAuth().signInWithEmailAndPassword(email, password);
  }

  if (!provider) {
    return Promise.reject({
      code: 'custom/missing-provider',
      message: 'provider argument is null or undefined',
    });
  }

  return FirebaseAuth()
    .signInWithPopup(provider)
    .then(async (credentials) => {
      await Firestore().collection('Users').doc(credentials.user.uid).set(
        {
          name: credentials.user.displayName,
          avatar: credentials.user.photoURL,
          role: 'developer',
          id: credentials.user.uid,
        },
        { merge: true }
      );
      return credentials;
    });
}

export async function signout() {
  return FirebaseAuth().signOut();
}
