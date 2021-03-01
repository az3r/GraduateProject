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
  const response = await fetch({
    method: 'POST',
    url: `${compiler}${langs[lang.toLowerCase()]}`,
    body: {
      code,
      testcases,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.json();
  if (response.status === '200') {
    const { failed } = data;
    const status = failed > 0 ? statuses.failed : statuses.passed;
    if (save) {
      Firestore().collection(users).doc(uid).collection('submissions').set({
        problemId,
        problemName,
        createdOn: Firestore.Timestamp.now(),
        status,
        result: data,
      });
    }
    return data;
  }
  if (save) {
    Firestore().collection(users).doc(uid).collection('submissions').set({
      problemId,
      problemName,
      createdOn: Firestore.Timestamp.now(),
      status: statuses.error,
      result: data,
    });
  }
  return Promise.reject(data);
}