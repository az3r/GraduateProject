import React, { useState } from 'react';
import Head from 'next/head';
import TestCode from '../code';
import TestMCQ from '../mcq';

export default function Start() {
  const [problem, setProblem] = useState('code');

  const nextProblem = () => {
    if (problem === 'code') {
      setProblem('mcq');
    } else {
      setProblem('code');
    }
  };

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {problem === 'code' ? (
        <TestCode
          problem={problem}
          nextProblem={nextProblem}
         />
      ) : (
        <TestMCQ problem={problem} nextProblem={nextProblem} />
      )}
    </>
  );
}
