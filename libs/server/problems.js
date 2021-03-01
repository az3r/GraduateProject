import { collections } from '@utils/constants';
import { Firestore } from './firebase_server';

const { problems } = collections;

export async function get(problemId) {
  if (problemId) {
    const snapshot = await Firestore()
      .collection(problems)
      .doc(problemId)
      .get();
    return snapshot.data();
  }
  const snapshot = await Firestore().collection(problems).get();
  return snapshot.docs.map((item) => item.data());
}

export const a = 5;
