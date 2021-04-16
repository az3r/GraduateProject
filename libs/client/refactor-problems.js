import { collections } from '@utils/constants';
import { transform, getAttributeReference } from '@utils/refactor-firestore';
import { Firestore } from './firebase';

export async function create(
  id,
  { cases, code, content, difficulty, language, score, title, published }
) {
  const { id: problemId, parent } = await Firestore()
    .collection(collections.problems)
    .add({
      owner: id,
      difficulty,
      language,
      score,
      title,
      published,
      createdOn: Firestore.Timestamp.now(),
      deleted: false,
    });

  // create private attributes
  await parent
    .doc(problemId)
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ id: problemId, cases, code, content });
  return problemId;
}

/** get all problems basic info without their private attributes */
export async function getAll(id) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('owner', '==', id)
    .where('deleted', '==', false)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

/** get a problem and its private attributes, using a problemId or a problem itself */
export async function get({ problemId, problem }) {
  if (problem) {
    const attributes = await getAttributeReference(
      collections.problems,
      problem.id
    ).get();
    return Object.assign(problem, { ...attributes.data() });
  }
  if (problemId) {
    const snippet = await Firestore()
      .collection(collections.problems)
      .doc(problemId)
      .get();

    const attributes = await getAttributeReference(
      collections.problems,
      problemId
    ).get();

    return Object.assign(snippet, { ...attributes.data() });
  }
  return undefined;
}

export async function update(
  problemId,
  { cases, code, content, difficulty, language, score, title }
) {
  await Firestore().collection(collections.problems).doc(problemId).update({
    difficulty,
    language,
    score,
    title,
    modifiedAt: Firestore.Timestamp.now(),
  });

  await getAttributeReference(collections.problems, problemId).update({
    cases,
    code,
    content,
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
  await getAttributeReference(collections.problems, problemId).update({
    participants: Firestore.FieldValue.arrayUnion(developerId),
  });
}

/** get all developers who have at least 1 submission */
export async function getParticipants(problem) {
  if (problem?.participants?.length > 0) {
    const developers = await Firestore()
      .collection(collections.developers)
      .where(Firestore.FieldPath.documentId(), 'in', problem.participants)
      .get();
    return developers.docs.map((item) => item.data());
  }
  return [];
}
