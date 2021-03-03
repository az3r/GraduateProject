import { collections } from '@utils/constants';
import { Firestore } from './firebase';

const { exams, problems: problemCollection } = collections;

export async function create(
  userId,
  { title, content, isPrivate, password, startAt, endAt, problems }
) {
  const { id } = await Firestore().collection(exams).add({
    title,
    content,
    isPrivate,
    password,
    startAt,
    endAt,
    owner: userId,
    createdOn: Firestore.Timestamp.now(),
  });

  const tasks = problems.map((item) =>
    Firestore()
      .collection(exams)
      .doc(id)
      .collection(problemCollection)
      .doc()
      .set(item)
  );

  await Promise.all(tasks);
}

export async function get(examId) {
  if (examId) {
    const snapshot = await Firestore().collectionGroup(exams).doc(examId).get();
    return snapshot.data();
  }
  const snapshot = await Firestore().collection(exams).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
