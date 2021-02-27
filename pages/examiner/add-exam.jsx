import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const AddExamProblem = dynamic(
  () => import('../../components/Examiner/AddExamProblem')
  ,
  { ssr: false });

export default function AddProblem() {
  return (
    <>
      <Layout>
        <AddExamProblem></AddExamProblem>
      </Layout>
    </>
  );
}
