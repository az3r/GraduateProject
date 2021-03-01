import { Firestore, FirebaseAuth } from './firebase_client';

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
