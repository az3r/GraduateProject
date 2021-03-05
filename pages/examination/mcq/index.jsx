import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

const TestMCQ = dynamic(
  () => import('../../../components/TestMCQ'),
  { ssr: false }
);


export default function MCQ({ problem, nextProblem }) {

  return (
    <>
      <Layout>
        <TestMCQ problem={problem} nextProblem={nextProblem} />
      </Layout>
    </>
  );
}
