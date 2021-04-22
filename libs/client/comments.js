import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const {
  problems,
  comments,
  users,
  problemComments,
  exams,
  examComments,
} = collections;
export async function createProblemComment(
  problemId,
  { userId, username, avatar, content }
) {
  const { id } = await Firestore()
    .collection(problems)
    .doc(problemId)
    .collection(comments)
    .add({
      userId,
      username,
      avatar,
      content,
      createdOn: Firestore.Timestamp.now(),
    });

  // add to user's problem comments collection
  await Firestore()
    .collection(users)
    .doc(userId)
    .collection(problemComments)
    .doc(problemId)
    .set({ ownerId: userId });
  return id;
}

export async function createExamComment(
  examId,
  { userId, username, avatar, content }
) {
  const { id } = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(comments)
    .add({
      userId,
      username,
      avatar,
      content,
      createdOn: Firestore.Timestamp.now(),
    });

  // add to user's problem comments collection
  await Firestore()
    .collection(users)
    .doc(userId)
    .collection(examComments)
    .doc(examId)
    .set({ ownerId: userId });

  return id;
}

export async function updateComment(
  problemId,
  commentId,
  { userId, username, avatar, content }
) {
  return Firestore()
    .collection(problems)
    .doc(problemId)
    .collection(comments)
    .doc(commentId)
    .update({
      userId,
      username,
      avatar,
      content,
    });
}

export async function updateExamComment(
  examId,
  commentId,
  { userId, username, avatar, content }
) {
  return Firestore()
    .collection(exams)
    .doc(examId)
    .collection(comments)
    .doc(commentId)
    .update({
      userId,
      username,
      avatar,
      content,
    });
}

export async function deleteProblemComment(problemId, commentId) {
  return Firestore()
    .collection(problems)
    .doc(problemId)
    .collection(comments)
    .doc(commentId)
    .delete();
}

export async function deleteExamComment(examId, commentId) {
  return Firestore()
    .collection(exams)
    .doc(examId)
    .collection(comments)
    .doc(commentId)
    .delete();
}
export async function getProblemComments(problemId) {
  console.log(problemId);
  const snapshot = await Firestore()
    .collection(problems)
    .doc(problemId)
    .collection(comments)
    .orderBy('createdOn', 'desc')
    .get();

  // return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
  return snapshot.docs.map((doc) => transform(doc));
}

export async function getExamComments(examId) {
  const snapshot = await Firestore()
    .collection(exams)
    .doc(examId)
    .collection(comments)
    .orderBy('createdOn', 'asc')
    .get();

  return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
}

/**
 * update usernames and avatars for all of the comments of user with userId
 * @param {*} userId the user's uid from FirebaseAuth
 */
export async function updateUserComments(userId, { username, avatar }) {
  // get all problems that have user's comments
  const problemIds = await Firestore()
    .collection(users)
    .doc(userId)
    .collection(problemComments)
    .get();

  // get all problems that have user's comments
  const examIds = await Firestore()
    .collection(users)
    .doc(userId)
    .collection(examComments)
    .get();

  // update all comments
  const problemTasks = problemIds.docs.map(async (problem) => {
    const snapshot = await Firestore()
      .collection(problems)
      .doc(problem.id)
      .collection(comments)
      .where('userId', '==', userId)
      .get();
    await Promise.all(
      snapshot.docs.map(async (comment) =>
        comment.ref.update({ username, avatar })
      )
    );
  });

  const examTasks = examIds.docs.map(async (exam) => {
    const snapshot = await Firestore()
      .collection(exams)
      .doc(exam.id)
      .collection(comments)
      .where('userId', '==', userId)
      .get();
    await Promise.all(
      snapshot.docs.map(async (comment) =>
        comment.ref.update({ username, avatar })
      )
    );
  });
  await Promise.all([problemTasks, examTasks]);
}
