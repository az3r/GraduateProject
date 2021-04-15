import { collections } from '@utils/constants';
import { transform } from '@utils/refactor-firestore';
import { Firestore } from './firebase';

export async function create(
  id,
  { cases, code, content, difficulty, language, score, title }
) {
  const { id: problemId } = await Firestore()
    .collection(collections.problems)
    .add({
      owner: id,
      cases,
      code,
      content,
      difficulty,
      language,
      score,
      title,
      createdOn: Firestore.Timestamp.now(),
      deleted: false,
    });
  return problemId;
}

export async function getAll(id) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('owner', '==', id)
    .where('deleted', '==', false)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

export async function get(problemId) {
  const document = await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .get();
  return transform(document);
}

export async function update(
  problemId,
  { cases, code, content, difficulty, language, score, title }
) {
  await Firestore().collection(collections.problems).doc(problemId).update({
    cases,
    code,
    content,
    difficulty,
    language,
    score,
    title,
    modifiedAt: Firestore.Timestamp.now(),
  });
  return true;
}

export async function remove(problemId) {
  await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .update({ deleted: true });
}

/** add developer to problem's partcipants list */
export async function addDeveloper(problemId, developerId) {
  const doc = await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .collection(collections.participants)
    .doc(developerId)
    .get();
  if (!doc.exists) await doc.ref.set({ createdOn: Firestore.Timestamp.now() });
}

/** get all developers who have at least 1 submission */
export async function getParticipants(problemId) {
  const participants = await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .collection(collections.participants)
    .get();
  if (participants.empty) return [];

  const developers = await Firestore()
    .collection(collections.accounts)
    .where(
      Firestore.FieldPath.documentId(),
      'in',
      participants.docs.map((doc) => doc.id)
    )
    .get();
  return developers.docs.map((item) => item.data());
}
