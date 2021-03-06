import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

const AddCodeProblem = dynamic(
  () => import('../../../components/Examiner/Problems/AddCodeProblem'),
  { ssr: false });

export default function AddProblem() {
  return (
    <>
      <Layout>
        <AddCodeProblem />
      </Layout>
    </>
  );
}
