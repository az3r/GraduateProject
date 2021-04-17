import { urls } from '@utils/constants';
import { FirebaseAuth } from './firebase';

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
  const task = fetch(`${compiler}${langs[lang.toLowerCase()]}`, {
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

  const sum = testcases.reduce((a, b) => a.score + b.score);

  const response = await task;
  const data = await response.json();
  let status = statuses.error;
  let score = 0;

  if (response.status === 200) {
    const { failed } = data;
    status = failed > 0 ? statuses.failed : statuses.passed;
    score =
      sum -
      data.failedIndexes.reduce((a, _, bIndex) => a + testcases[bIndex].score);
  }
  const result = { ...data, status, score };
  return response.status === 200 ? result : Promise.reject(result);
}
