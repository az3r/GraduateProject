import { collections } from '@utils/constants';
import { Firestore } from './firebase';

const { problems } = collections;

export default async function create(
  userId,
  { title, language, score, content, difficulty, code, cases }
) {
  await Firestore().collection(problems).doc().set({
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
}

export async function get(problemId) {
  if (problemId) {
    const snapshot = await Firestore()
      .collection(problems)
      .doc(problemId)
      .get();
    return snapshot.data();
  }
  const snapshot = await Firestore().collection(problems).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
