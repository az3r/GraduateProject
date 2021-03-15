import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore, FirebaseAuth } from './firebase';

const { problems, exams, users } = collections;

/** require user to be signed in */
export async function get() {
  const info = await Firestore().collection(users).doc(uid).get();
  const {
    displayName: name,
    email,
    photoURL: avatar,
    uid,
  } = FirebaseAuth().currentUser;
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
  location,
  website,
  education,
  work,
  technicalSkills,
}) {
  const { displayName, photoURL, uid } = FirebaseAuth().currentUser;

  const infoTask = Firestore().collection(users).doc(uid).set(
    {
      location,
      website,
      education,
      work,
      technicalSkills,
    },
    { merge: true }
  );
  const profileTask = FirebaseAuth().currentUser.updateProfile({
    displayName: name || displayName,
    photoURL: avatar || photoURL,
  });

  await Promise.all(infoTask, profileTask);
}

export async function getProblems(uid) {
  const snapshot = await Firestore()
    .collection(problems)
    .where('owner', '==', uid)
    .get();
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

export async function getExams(uid) {
  const snapshot = await Firestore()
    .collection(exams)
    .where('owner', '==', uid)
    .get();

  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}
