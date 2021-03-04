import { collections } from '@utils/constants';
import { Firestore } from './firebase';
import { create as createProblem } from './problems';

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
    createProblem(userId, { examId: id, ...item })
  );
  await Promise.all(tasks);
  return id;
}

export async function get(examId, { withProblems }) {
  if (examId) {
    const snapshot = await Firestore().collection(exams).doc(examId).get();
    const problems =
      withProblems &&
      (await Firestore()
        .collection(exams)
        .doc(examId)
        .collection(problemCollection)
        .get());
    return {
      problems: problems || undefined,
      ...snapshot.data(),
    };
  }
  const snapshot = await Firestore().collection(exams).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getProblems(examId) {
  const snapshot = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(problemCollection)
    .get();
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}
