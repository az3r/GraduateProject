import React from 'react';
import Head from 'next/head';
import ProblemsPage from '@components/Examiner/Problems';
import Layout from '../../../components/Layout';
import Examiner from '../../../components/Examiner';

export default function ExaminerPage() {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner>
            <ProblemsPage />
        </Examiner>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
 
  return {
    props:{
     
    }
  }
}