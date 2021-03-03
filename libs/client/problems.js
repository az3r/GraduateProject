import { collections } from '@utils/constants';
import { Firestore } from './firebase';

const { problems, exams } = collections;

export async function create(
  userId,
  { title, language, score, content, difficulty, code, cases }
) {
  const { id } = await Firestore()
    .collection(exams)
    .doc()
    .collection(problems)
    .add({
      isMCQ: false,
      title,
      language,
      score,
      content,
      difficulty,
      code,
      cases,
      owner: userId,
      createdOn: Firestore.Timestamp.now(),
    });

  await Firestore().collection(`${exams}/${problems}`).doc(id).set({ id });
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
    return snapshot.docs[0].data();
  }
  const snapshot = await Firestore()
    .collectionGroup(problems)
    .where('isMCQ', '==', false)
    .get();
  return snapshot.docs.map((item) => item.data());
}
