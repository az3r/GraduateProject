import { Firestore } from './firebase_client';

export async function data(uid) {
  const user = Firestore().collection('Users').doc(uid).get();
  return user.data();
}
