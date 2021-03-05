import { collections, urls } from '@utils/constants';
import { Firestore, FirebaseAuth } from './firebase';

const { users } = collections;
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

export async function test({
  problemId,
  problemName,
  lang,
  code,
  testcases,
  save,
}) {
  const { uid } = FirebaseAuth().currentUser;
  const token = await FirebaseAuth().currentUser.getIdToken(true);
  const response = await fetch(`${compiler}${langs[lang.toLowerCase()]}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line prefer-template
      Authorization: 'Bearer ' + token,
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

  if (save) {
    Firestore()
      .collection(users)
      .doc(uid)
      .collection('submissions')
      .set({
        problemId,
        problemName,
        status,
        details: { code, ...data },
        createdOn: Firestore.Timestamp.now(),
      });
  }
  return response.status === 200 ? data : Promise.reject(data);
}
