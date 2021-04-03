import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const { exams, problems: problemCollection, users } = collections;

export async function create(
  userId,
  { title, content, isPrivate, password, startAt, endAt, problems }
) {
  const { minutes, seconds, score } = problems.reduce((prev, current) => ({
    minutes: prev.minutes + current.minutes,
    seconds: prev.seconds + current.seconds,
    score: prev.score + current.score,
  }));
  const { id } = await Firestore().collection(exams).add({
    title,
    content,
    isPrivate,
    password,
    startAt,
    endAt,
    minutes,
    seconds,
    score,
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
  const snapshot = await Firestore()
    .collection(exams)
    .orderBy('createdOn', 'desc')
    .get();
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
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

export async function getParticipants(examId) {
  // get participants' ids
  const exam = await Firestore().collection(exams).doc(examId).get();
  const ids = exam.get('participants');
  if (ids.length === 0) {
    return [];
  }

  const participants = await Firestore()
    .collection(users)
    .where('id', 'in', ids)
    .get();
  return participants.docs.map((item) => item.data());
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

export async function inviteUsers(examId, userIds) {
  await Firestore()
    .collection(exams)
    .doc(examId)
    .update({
      invitedUsers: Firestore.FieldValue.arrayUnion(userIds),
    });
}

export async function uninviteUser(examId, userIds) {
  await Firestore()
    .collection(exams)
    .doc(examId)
    .update({
      invitedUsers: Firestore.FieldValue.arrayRemove(userIds),
    });
}
