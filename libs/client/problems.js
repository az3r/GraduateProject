import { collections } from '@utils/constants';
import { Firestore } from './firebase';

const { problems, exams } = collections;

export default async function create(
  userId,
  { title, language, score, content, difficulty, code, cases }
) {
  await Firestore().collection(exams).doc().collection(problems).doc().set({
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
  return true;
}

export async function get(problemId) {
  if (problemId) {
    const snapshot = await Firestore()
      .collectionGroup(problems)
      .doc(problemId)
      .get();
    return snapshot.data();
  }
  const snapshot = await Firestore()
    .collectionGroup(problems)
    .where('isMCQ', '==', false)
    .get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
