import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
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

  const tasks = problems.map((item) => createProblem(id, item));
  await Promise.all(tasks);
  return id;
}

export async function update(
  examId,
  { title, content, isPrivate, password, startAt, endAt, problems }
) {
  const docRef = Firestore().collection(exams).doc(examId);
  await docRef.update({
    title,
    content,
    isPrivate,
    password,
    startAt,
    endAt,
    modifiedAt: Firestore.Timestamp.now(),
  });

  const examProblems = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(problemCollection)
    .get();
  const deleteTasks = examProblems.docs.map((item) => item.ref.delete());
  await Promise.all(deleteTasks);
  const createTasks = problems.map((item) => createProblem(examId, item));
  await Promise.all(createTasks);
}
export async function get(examId, { withProblems }) {
  if (examId) {
    const snapshot = await Firestore().collection(exams).doc(examId).get();
    const problems = withProblems && (await getProblems(examId));
    return transform({
      id: examId,
      problems: problems || null,
      ...snapshot.data(),
    });
  }
  const snapshot = await Firestore().collection(exams).get();
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

export async function getProblems(examId) {
  const snapshot = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(problemCollection)
    .get();
  return snapshot.docs.map((item) => transform(item.data()));
}

async function createProblem(examId, props) {
  // exam already had owner and createdOn fields
  const { id } = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(problemCollection)
    .add(props);
  return id;
}
