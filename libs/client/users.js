import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const { problems, exams, users } = collections;

export async function data(uid) {
  const user = Firestore().collection(users).doc(uid).get();
  return user.data();
}

export async function getProblems(uid) {
  const snapshot = await Firestore()
    .collection(exams)
    .doc('general')
    .collection(problems)
    .where('owner', '==', uid)
    .get();
  return snapshot.docs.map((item) => transform(item.data()));
}

export async function getExams(uid) {
  const snapshot = await Firestore()
    .collection(exams)
    .where('owner', '==', uid)
    .get();

  return snapshot.docs.map((item) => transform(item.data()));
}
