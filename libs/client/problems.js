import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';
import { Firestore } from './firebase';

/** nếu company tạo problem có thể bỏ field developerId */
export async function create(
  companyId,
  { cases, code, content, difficulty, language, title, published, developerId }
) {
  // calculate score
  let score = 0;
  cases.forEach((testCase) => {
    score += testCase.score;
  });
  if (!cases?.length) throw new Error('no testcase provided');
  const { id: problemId, parent } = await Firestore()
    .collection(collections.problems)
    .add({
      companyId,
      owner: developerId || companyId,
      difficulty,
      language,
      title,
      published,
      score,
      createdOn: Firestore.Timestamp.now(),
      deleted: false,
    });

  // create private attributes
  await parent
    .doc(problemId)
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ parent: problemId, cases, code, content });
  return problemId;
}

/** nếu company tạo problem có thể bỏ field developerId */
export async function createMCQ(
  companyId,
  { title, score, difficulty, answers, correctIndices, developerId }
) {
  const { id: problemId, parent } = await Firestore()
    .collection(collections.problems)
    .add({
      companyId,
      owner: developerId || companyId,
      difficulty,
      title,
      score,
      isMCQ: true,
      createdOn: Firestore.Timestamp.now(),
      deleted: false,
    });

  // create private attributes
  await parent
    .doc(problemId)
    .collection(collections.attributes)
    .doc(collections.attributes)
    .set({ id: problemId, answers, correctIndices });
  return problemId;
}

/** get a problem and its private attributes, using a problemId or a problem itself */
export async function get({ problem = undefined, problemId = undefined }) {
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

export async function getPublishedProblems() {
  const problems = await Firestore()
    .collection(collections.problems)
    .where('published', '==', true)
    .orderBy('createdOn', 'desc')
    .get();
  return problems.docs.map((problem) => transform(problem));
}

/**
 * update a problem, require developerId to be companyId or owner of this problem
 * @param {*} problem problem object
 * @param {*} developerId
 * @param {*} properties problem's properties
 */
export async function update(
  id,
  { cases, code, content, difficulty, language, title, published }
) {
  // calculate score
  let score = 0;
  cases.forEach((testCase) => {
    score += testCase.score;
  });
  await Firestore().collection(collections.problems).doc(id).update({
    difficulty,
    language,
    score,
    title,
    published,
    modifiedAt: Firestore.Timestamp.now(),
  });

  await getAttributeReference(collections.problems, id).update({
    cases,
    code,
    content,
  });
  return true;
}

export async function updateMCQ(
  id,
  { title, difficulty, score, answers, correctIndices }
) {
  await Firestore().collection(collections.problems).doc(id).update({
    difficulty,
    title,
    score,
    modifiedAt: Firestore.Timestamp.now(),
  });

  await getAttributeReference(collections.problems, id).update({
    answers,
    correctIndices,
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

// 1. lấy tất cả user chưa có trong company đó
// 2. lấy tất cả submissions của problem
export async function getSubmission(problemId) {
  const snapshot = await Firestore()
    .collectionGroup(collections.problemSubmissions)
    .where('problemId', '==', problemId)
    .orderBy('createdOn', 'desc')
    .get();

  return snapshot.docs.map((doc) => transform(doc));
}
