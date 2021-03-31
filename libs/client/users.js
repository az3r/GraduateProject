import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore, FirebaseAuth } from './firebase';

const {
  problems,
  exams: examCollection,
  users,
  problemSubmissions,
  joinedExams,
  solvedProblems,
} = collections;

export async function get(userId) {
  const uid = userId || FirebaseAuth().currentUser.uid;
  const user = await Firestore().collection(users).doc(uid).get();
  if (user.exists)
    return {
      ...user.data(),
      id: user.id,
      role: user.get('role') || 'developer',
    };
  return undefined;
}

/** require user to be signed in */
export async function update({
  name,
  avatar,
  location,
  website,
  birthday,
  gender,
  education,
  technicalSkills,
  experiences,
}) {
  const { displayName, photoURL, uid } = FirebaseAuth().currentUser;

  const infoTask = Firestore().collection(users).doc(uid).update({
    name,
    avatar,
    location,
    birthday,
    website,
    gender,
    education,
    experiences,
    technicalSkills,
  });
  const profileTask = FirebaseAuth().currentUser.updateProfile({
    displayName: name || displayName,
    photoURL: avatar || photoURL,
  });

  await Promise.all(infoTask, profileTask);
}

/** get problems own by user */
export async function getProblems(uid) {
  const snapshot = await Firestore()
    .collection(problems)
    .where('owner', '==', uid)
    .get();
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

/** get problems which user submitted answers */
export async function getSubmittedProblems(uid) {
  // get all problems' ids in user submission collection
  const submissions = await Firestore()
    .collection(users)
    .doc(uid)
    .collection(problemSubmissions)
    .get();
  const ids = new Set(submissions.docs.map((doc) => doc.get('problemId')));

  const snapshot = await Firestore()
    .collection(problems)
    .where(Firestore.FieldPath.documentId(), 'in', ids)
    .get();

  return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
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
  if (exams === []) return [];

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

/**
 * retrieve user by their roles
 * @param {string} role one of 'developer', 'admin', 'company'
 * @returns
 */
export async function getUsers(role) {
  const results = await Firestore()
    .collection(users)
    .where('role', '==', role)
    .get();
  return results.docs.map((item) => item.data());
}

export async function updateScoreProblem(userId, problemId, value) {
  // update total score
  const ref = Firestore().collection(users).doc(userId);
  await ref.update({ problemScore: Firestore.FieldValue.increment(value) });

  // update passed problems
  await ref
    .collection(solvedProblems)
    .doc(problemId)
    .set({ id: problemId, score: value });
}

export async function updateScoreExam(userId, examId, value) {
  // update total score
  const ref = Firestore().collection(users).doc(userId);
  await ref.update({ examScore: Firestore.FieldValue.increment(value) });

  // update participated exams
  await ref
    .collection(joinedExams)
    .doc(examId)
    .set({ id: examId, score: value });
}
