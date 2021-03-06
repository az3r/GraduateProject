import React from 'react';
import Head from 'next/head';
import ExaminationsPage from '@components/Examiner/Examinations';
import Examiner from '../../../components/Examiner';
import Layout from '../../../components/Layout';

export default function ExaminerPage() {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner>
            <ExaminationsPage />
        </Examiner>
      </Layout>
    </>
  );
}
