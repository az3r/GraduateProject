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
  timeout: 'runtime-error',
};

export async function test({ lang, code, testcases, runtime }) {
  if (!testcases?.length) throw new Error('no testcase provided');

  let token = null;
  try {
    token = await FirebaseAuth().currentUser.getIdToken(true);
  } catch (e) {
    token = 'userId';
  }

  const task = fetch(`${compiler}${langs[lang.toLowerCase()]}`, {
    method: 'POST',
    headers: {
      'Content-Security-Policy': 'upgrade-insecure-requests',
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

  // failed
  if (response.status >= 400) {
    return Promise.reject({
      ...data,
      status: data.code ? statuses.error : statuses.timeout,
      score: 0,
    });
  }

  // success
  const status = data.failed > 0 ? statuses.failed : statuses.passed;
  let score = total;

  // subtract for every fail test case
  let amount = 0;
  data.failedIndexes?.forEach((i) => {
    amount += testcases[i].score;
  });
  score = total - amount;

  // compare with runtime requirements
  for (let i = 0; i < runtime.length; i += 1) {
    if (data.totalElapsedTime < runtime[i].runtime) {
      score *= runtime[i].percentage / 100;
      break;
    }
  }

  return {
    ...data,
    score,
    status,
  };
}
