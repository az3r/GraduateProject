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
      id: credentials.user.uid,
      name: username,
      email,
      avatar,
      role: role || 'developer',
      problemScore: 0,
      examScore: 0,
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
    if (results.empty) return Promise.reject({ code: 'auth/user_not_found' });
    const email = results.docs[0].get('email');
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
      const user = await Firestore()
        .collection('Users')
        .doc(credentials.user.uid)
        .get();

      // create new user if this is first time login
      if (!user.exists) {
        await Firestore().collection('Users').doc(credentials.user.uid).set(
          {
            name: credentials.user.displayName,
            avatar: credentials.user.photoURL,
            email: credentials.user.email,
            role: 'developer',
            id: credentials.user.uid,
            problemScore: 0,
            examScore: 0,
          },
          { merge: true }
        );
      }
      return credentials;
    });
}

export async function signout() {
  return FirebaseAuth().signOut();
}
