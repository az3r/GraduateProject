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
  if (!testcases?.length) throw new Error('no testcase provided');

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

  const total = testcases.reduce((a, b) => ({
    score: a.score + b.score,
  })).score;
  const response = await task;
  const data = await response.json();
  let status = statuses.error;

  let score = response.status === 200 ? total : 0;
  if (response.status === 200) {
    const { failed, failedIndexes } = data;
    status = failed > 0 ? statuses.failed : statuses.passed;

    // subtract score for every failed testcase
    if (failedIndexes?.length) {
      const amount =
        failedIndexes.reduce((current, { score: next }) => current + next) || 0;
      score -= amount;
    }
  }
  const result = { ...data, status, score };
  return response.status === 200 ? result : Promise.reject(result);
}
