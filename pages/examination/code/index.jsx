import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

const TestCode = dynamic(
  () => import('../../../components/TestCode'),
  { ssr: false }
);


export default function Code({ problem, nextProblem }) {

  return (
    <>
      <Layout>
        <TestCode problem={problem} nextProblem={nextProblem} />
      </Layout>
    </>
  );
}
