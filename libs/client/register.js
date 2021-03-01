import { FirebaseAuth, Firestore } from './firebase_client';

export default async function register({ username, email, password, role }) {
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
