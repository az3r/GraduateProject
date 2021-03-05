import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const { problems, exams } = collections;

export async function create(userId, { examId, ...props }) {
  console.log(props);
  const { id, path } = await Firestore()
    .collection(exams)
    .doc(examId || 'general')
    .collection(problems)
    .add({
      owner: userId,
      createdOn: Firestore.Timestamp.now(),
      ...props,
    });

  await Firestore()
    .collection(path.replace(id, ''))
    .doc(id)
    .set({ id }, { merge: true });
  return id;
}

export async function get(problemId) {
  if (problemId) {
    const snapshot = await Firestore()
      .collectionGroup(problems)
      .where('id', '==', problemId)
      .limit(1)
      .get();
    if (snapshot.empty)
      return Promise.reject({
        code: 'not-found',
        message: `There is no document with id ${problemId}`,
      });
    return transform(snapshot.docs[0].data());
  }
  const snapshot = await Firestore()
    .collectionGroup(problems)
    .where('isMCQ', '==', false)
    .get();
  return snapshot.docs.map((item) => transform(item.data()));
}
