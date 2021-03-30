import { collections, urls } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore, FirebaseAuth } from './firebase';

const { users, problemSubmissions, examSubmissions, problems } = collections;
const { compiler } = urls;
const langs = {
  csharp: 'csharp',
  python: 'py3',
  java: 'java',
};
const statuses = {
  passed: 'passed',
  failed: 'failed',
  error: 'syntax-error',
};

export async function test({ lang, code, testcases }) {
  const token = await FirebaseAuth().currentUser.getIdToken(true);
  const response = await fetch(`${compiler}${langs[lang.toLowerCase()]}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code,
      testcases,
    }),
  });

  const data = await response.json();
  let status = statuses.error;

  if (response.status === 200) {
    const { failed } = data;
    status = failed > 0 ? statuses.failed : statuses.passed;
  }
  const result = { ...data, status };
  return response.status === 200 ? result : Promise.reject(result);
}

export async function getProblemSubmissions(userId, problemId) {
  const snapshot = await Firestore()
    .collection(users)
    .doc(userId)
    .collection(problemSubmissions)
    .where('problemId', '==', problemId)
    .get();

  return snapshot.docs.map((doc) => transform(doc.data()));
}

/**
 * @example
 * // for code problems, retrieve data from test function
 * const codeResult = await test({
 *   lang: 'c#',
 *   code: 'submitted code',
 *   testcases: [<list of test casess>]
 * })
 * const id = await createExamSubmission('userid', {
 *   examId: 'examid',
 *   total: 10,
 *   correct: '5',
 *   results: [
 *     {
 *       problemId: 'problemId',
 *       problemName: 'problemName',
 *       isMCQ: false,
 *       status: codeResult.status,
 *       details: {
 *         code: 'submitted code',
 *         ...codeResult
 *       }
 *     },
 *     {
 *       problemId: 'problemid',
 *       problemName: 'problem name',
 *       isMCQ: true,
 *       status: failed | true
 *       details: {
 *         selectedAnswer: 'A',
 *         correctAnswer: 'B'
 *       }
 *     }
 *   ]
 * })
 * @param {string} userId user's uid retrieve from firebase auth
 * @
 */
export async function createExamSubmission(
  userId,
  { examId, total, correct, results }
) {
  const { id } = await Firestore()
    .collection(users)
    .doc(userId)
    .collection(examSubmissions)
    .add({
      examId,
      total,
      correct,
      createdOn: Firestore.Timestamp.now(),
      results,
    });
  return id;
}

export async function createProblemSubmission(
  userId,
  { problemId, problemName, status, code, data }
) {
  const { id } = await Firestore()
    .collection(users)
    .doc(userId)
    .collection(problemSubmissions)
    .add({
      problemId,
      problemName,
      status,
      details: { code, ...data },
      createdOn: Firestore.Timestamp.now(),
    });

  // add user to problem's participants
  await Firestore()
    .collection(problems)
    .doc(problemId)
    .update({ participants: Firestore.FieldValue.arrayUnion(userId) });
  return id;
}
