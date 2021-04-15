import { collections } from '@utils/constants';
import { transform } from '@utils/refactor-firestore';
import { Firestore } from './firebase';

export async function get(uid) {
  const document = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .get();
  return transform(document);
}

/** get problems which user submitted answers */
export async function getProblemSubmissions(uid) {
  // get all problems' ids in user submission collection
  const submissions = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .collection(collections.problemSubmissions)
    .get();

  if (submissions.empty) return [];

  const ids = submissions.docs.map((doc) => doc.get('problemId'));

  const snapshot = await Firestore()
    .collection(collections.problems)
    .where(Firestore.FieldPath.documentId(), 'in', [...new Set(ids)])
    .get();

  return snapshot.docs.map((doc) => transform(doc));
}

/** get exams in which developer participated */
export async function getJoinedExams(examIds) {
  const snapshot = await Firestore()
    .collection(collections.exams)
    .where(Firestore.FieldPath.documentId(), 'in', examIds)
    .get();

  return snapshot.docs.map((doc) => transform(doc));
}

export async function joinExam(uid, examId) {
  // add user to exam's participants
  await Firestore()
    .collection(collections.exams)
    .doc(examId)
    .update({
      participants: Firestore.FieldValue.arrayUnion(uid),
    });

  // add exam to user's particated exams
  return Firestore()
    .collection(collections.developers)
    .doc(uid)
    .update({ joinedExams: Firestore.FieldValue.arrayUnion(examId) });
}

export async function leaveExam(uid, examId) {
  // remove user from exam's participants
  await Firestore()
    .collection(collections.exams)
    .doc(examId)
    .update({
      participants: Firestore.FieldValue.arrayRemove(uid),
    });

  // remove exam from user's particated exams
  return Firestore()
    .collection(collections.developers)
    .doc(uid)
    .update({ joinedExams: Firestore.FieldValue.arrayRemove(examId) });
}

export async function updateScoreProblem(
  { id, problemScore },
  problemId,
  score
) {
  const ref = Firestore().collection(collections.developers).doc(id);

  // add or update problem in user's solveProblems collection
  const problem = await ref
    .collection(collections.solvedProblems)
    .doc(problemId)
    .get();
  if (problem.exists)
    await problem.ref.update({ modifiedAt: Firestore.Timestamp.now(), score });
  else await problem.ref.set({ createdOn: Firestore.Timestamp.now(), score });

  // update total score
  await ref.update({
    problemScore: problemScore - problem.exists ? problem.score : 0 + score,
  });
}

export async function updateScoreExam({ id, examScore }, examId, score) {
  const ref = Firestore().collection(collections.developers).doc(id);

  // add or update exam in user's examResults collection
  const exam = await ref.collection(collections.examResults).doc(examId).get();
  if (exam.exists)
    await exam.ref.update({ modifiedAt: Firestore.Timestamp.now(), score });
  else await exam.ref.set({ createdOn: Firestore.Timestamp.now(), score });

  // update total score
  await ref.update({
    examScore: examScore - exam.exists ? exam.score : 0 + score,
  });
}

export async function getExamScoreboard() {
  const result = await Firestore()
    .collection(collections.developers)
    .orderBy('examScore:', 'desc')
    .orderBy('name', 'asc')
    .orderBy(Firestore.FieldPath.documentId(), 'asc')
    .get();
  return result.docs.map((doc) => doc.data());
}

export async function getSolvedProblems(uid) {
  const ids = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .collection(collections.solvedProblems)
    .get();

  const problems = await Firestore()
    .collection(collections.problems)
    .where(
      Firestore.FieldPath.documentId(),
      'in',
      ids.docs.map((item) => item.id)
    )
    .get();
  return problems.docs.map((doc) => transform(doc));
}
