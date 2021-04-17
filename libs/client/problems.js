import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';
import { Firestore } from './firebase';

export async function create(
  id,
  { cases, code, content, difficulty, language, title, published }
) {
  const { id: problemId, parent } = await Firestore()
    .collection(collections.problems)
    .add({
      owner: id,
      difficulty,
      language,
      title,
      published,
      score: cases.reduce((a, b) => a.score + b.score),
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

/** get a problem and its private attributes, using a problemId or a problem itself */
export async function get({ problemId, problem }) {
  if (problem) {
    const attributes = await getAttributeReference(
      collections.problems,
      problem.id
    ).get();
    return Object.assign(problem, attributes.data());
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

    return Object.assign(transform(snippet), attributes.data());
  }
  return undefined;
}

export async function update(
  problemId,
  { cases, code, content, difficulty, language, title }
) {
  await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .update({
      difficulty,
      language,
      score: cases.reduce((a, b) => a.score + b.score),
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
