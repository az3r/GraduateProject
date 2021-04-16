import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/refactor-firestore';
import { Firestore } from './firebase';

/** get a developer and its private attirbutes */
export async function get(uid) {
  const document = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .get();
  const attributes = await getAttributeReference(
    collections.developers,
    uid
  ).get();
  return transform(document, attributes);
}

/** get all developers' basic info */
export async function getAll() {
  const developers = await Firestore().collection(collections.developers).get();
  return developers.docs.map((dev) => transform(dev));
}

export async function update(
  uid,
  { websites, location, gender, birthday, technicalSkills, experiences }
) {
  await getAttributeReference(collections.developers, uid).update({
    websites,
    location,
    gender,
    birthday,
    technicalSkills,
    experiences,
  });
}

/** get exams' basic info in which developer participated */
export async function getJoinedExams(developer) {
  if (developer?.joinedExams?.length > 0) {
    const snapshot = await Firestore()
      .collection(collections.exams)
      .where(Firestore.FieldPath.documentId(), 'in', developer.joinedExams)
      .get();

    return snapshot.docs.map((doc) => transform(doc));
  }

  return [];
}

export async function joinExam(uid, examId) {
  // add user to exam's participants
  await getAttributeReference(collections.exams, examId).update({
    participants: Firestore.FieldValue.arrayUnion(uid),
  });

  // add exam to user's particated exams
  return getAttributeReference(collections.developers, uid).update({
    joinedExams: Firestore.FieldValue.arrayUnion(examId),
  });
}

export async function leaveExam(uid, examId) {
  // remove user from exam's participants
  await getAttributeReference(collections.exams, examId).update({
    participants: Firestore.FieldValue.arrayRemove(uid),
  });

  // remove exam from user's particated exams
  return getAttributeReference(collections.developers, uid).update({
    joinedExams: Firestore.FieldValue.arrayRemove(examId),
  });
}

export async function updateScoreProblem(
  { developerId, problemScore },
  problemId,
  score
) {
  const ref = Firestore().collection(collections.developers).doc(developerId);

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

export async function getUserByExamScore() {
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
