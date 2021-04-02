import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore, FirebaseAuth } from './firebase';

const { problems, exams, users, problemSubmissions } = collections;

/** require user to be signed in */
export async function get() {
  const {
    displayName: name,
    email,
    photoURL: avatar,
    uid,
  } = FirebaseAuth().currentUser;
  const info = await Firestore().collection(users).doc(uid).get();
  return {
    ...info.data(),
    name,
    email,
    avatar,
  };
}

/** require user to be signed in */
export async function update({
  name,
  avatar,
  websites,
  location,
  gender,
  birthday,
  technicalSkills,
  experiences,
}) {
  const { displayName, photoURL, uid } = FirebaseAuth().currentUser;

  const infoTask = Firestore().collection(users).doc(uid).update({
    websites,
    location,
    gender,
    birthday,
    technicalSkills,
    experiences,
  });
  const profileTask = FirebaseAuth().currentUser.updateProfile({
    displayName: name || displayName,
    photoURL: avatar || photoURL,
  });

  await Promise.all([infoTask, profileTask]);
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
    .collection(exams)
    .where('owner', '==', uid)
    .get();

  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

/** get exams in which user joined */
export async function getJoinedExams(uid) {
  const user = await Firestore().collection(users).doc(uid).get();

  const snapshot = await Firestore()
    .collection(exams)
    .where(Firestore.FieldPath.documentId(), 'in', user.get('joinedExams'))
    .get();

  return snapshot.docs.map((doc) => transform({ id: doc.id, ...doc.data() }));
}

export async function joinExam(uid, examId) {
  return Firestore()
    .collection(users)
    .doc(uid)
    .update({ joinedExams: Firestore.FieldValue.arrayUnion(examId) });
}
