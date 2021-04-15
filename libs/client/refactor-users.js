import { collections } from '@utils/constants';
import { transform } from '@utils/refactor-firestore';
import { Firestore, Storage } from './firebase';

const {
  problems: problemCollection,
  exams: examCollection,
  users,
  problemSubmissions,
  joinedExams,
  solvedProblems,
} = collections;

export async function find(uid) {
  if (!uid) return undefined;

  // search in Developers then Companies collection
  let results = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), '==', uid)
    .limit(1)
    .get();
  if (results.size > 0)
    return transform({ ...results.docs[0], role: 'developer' });

  results = await Firestore()
    .collection(collections.companies)
    .where(Firestore.FieldPath.documentId(), '==', uid)
    .limit(1)
    .get();
  if (results.size > 0)
    return transform({ ...results.docs[0], role: 'company' });

  return undefined;
}

export async function updateName(user, displayName) {
  await user.updateProfile({ displayName });
}

export async function updateAvatar(user, file) {
  // upload to storage
  const ref = Storage().ref(`avatars/${user.uid}`);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  // update avatar using upload url
  await user.updateProfile({ photoURL: url });
  return url;
}

export async function updateEmail(user, callback, email) {
  await user.verifyBeforeUpdateEmail(email, {
    url: callback,
  });
}

/** get problems which user submitted answers */
export async function getSubmittedProblems(uid) {
  // get all problems' ids in user submission collection
  const submissions = await Firestore()
    .collection(users)
    .doc(uid)
    .collection(problemSubmissions)
    .get();

  if (submissions.empty) return [];

  const ids = submissions.docs.map((doc) => doc.get('problemId'));

  if (ids.length === 0) return [];

  const snapshot = await Firestore()
    .collection(problemCollection)
    .where(Firestore.FieldPath.documentId(), 'in', ids)
    .get();

  return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
}

/** get problem submissions bu uid */
export async function getProblemSubmissions(uid) {
  // get all problems' ids in user submission collection
  const submissions = await Firestore()
    .collection(users)
    .doc(uid)
    .collection(problemSubmissions)
    .get();

  return submissions.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

/** get exams own by user */
export async function getExams(uid) {
  const snapshot = await Firestore()
    .collection(examCollection)
    .where('owner', '==', uid)
    .get();

  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

/** get exams in which user joined */
export async function getJoinedExams(uid) {
  const user = await Firestore().collection(users).doc(uid).get();
  const exams = user.get('joinedExams');
  if (exams === undefined || exams.length === 0) return [];

  const snapshot = await Firestore()
    .collection(examCollection)
    .where(Firestore.FieldPath.documentId(), 'in', exams)
    .get();

  return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
}

export async function joinExam(uid, examId) {
  // add user to exam's participants
  await Firestore()
    .collection(examCollection)
    .doc(examId)
    .update({
      participants: Firestore.FieldValue.arrayUnion(uid),
    });

  // add exam to user's particated exams
  return Firestore()
    .collection(users)
    .doc(uid)
    .update({ joinedExams: Firestore.FieldValue.arrayUnion(examId) });
}

export async function leaveExam(uid, examId) {
  // add user to exam's participants
  await Firestore()
    .collection(examCollection)
    .doc(examId)
    .update({
      participants: Firestore.FieldValue.arrayRemove(uid),
    });

  // add exam to user's particated exams
  return Firestore()
    .collection(users)
    .doc(uid)
    .update({ joinedExams: Firestore.FieldValue.arrayRemove(examId) });
}

export async function updateScoreProblem(userId, problemId, value) {
  const ref = Firestore().collection(users).doc(userId);
  // check if user has passed this problem
  const isSolved = await ref
    .collection(solvedProblems)
    .where('id', '==', problemId)
    .limit(1)
    .get();
  if (isSolved.size > 0) return;

  // update total score
  await ref.update({ problemScore: Firestore.FieldValue.increment(value) });

  // update passed problems
  await ref
    .collection(solvedProblems)
    .doc(problemId)
    .set({ id: problemId, score: value, createdOn: Firestore.Timestamp.now() });
}

export async function updateScoreExam(userId, examId, value) {
  // update total score
  const ref = Firestore().collection(users).doc(userId);
  await ref.update({ examScore: Firestore.FieldValue.increment(value) });

  // update participated exams
  await ref
    .collection(joinedExams)
    .doc(examId)
    .set({ id: examId, score: value, createdOn: Firestore.Timestamp.now() });
}

export async function getUsersByExamScore() {
  const result = await Firestore()
    .collection(users)
    .where('role', 'in', ['developer', 'company'])
    // .orderBy('examScore:', 'desc')
    // .orderBy('name', 'asc')
    .get();
  return result.docs.map((doc) => doc.data());
}

/** get all created problems and exams by user */
export async function getCreatedAll(uid) {
  const problemTask = Firestore()
    .collection(problemCollection)
    .where('owner', '==', uid)
    .get();
  const examTask = Firestore()
    .collection(examCollection)
    .where('owner', '==', uid)
    .get();

  const problems = await problemTask;
  const exams = await examTask;
  return [].concat(
    problems.docs.map((item) =>
      transform({
        id: item.id,
        createdOn: item.get('createdOn'),
        modifiedAt: item.get('modifiedAt'),
      })
    ),
    exams.docs.map((item) =>
      transform({
        id: item.id,
        createdOn: item.get('createdOn'),
        modifiedAt: item.get('modifiedAt'),
      })
    )
  );
}

export async function getSolvedProblems(uid) {
  const problemIds = await Firestore()
    .collection(users)
    .doc(uid)
    .collection(solvedProblems)
    .get();

  const problems = await Firestore()
    .collection(problemCollection)
    .where(
      Firestore.FieldPath.documentId(),
      'in',
      problemIds.docs.map((item) => item.id)
    )
    .get();
  return problems.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}
