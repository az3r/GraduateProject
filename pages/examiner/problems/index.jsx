import React from 'react';
import Head from 'next/head';
import ProblemsPage from '@components/Examiner/Problems';
import { getProblems } from '@libs/client/users';
import Layout from '../../../components/Layout';
import Examiner from '../../../components/Examiner';

export default function ExaminerPage({problems}) {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner>
            <ProblemsPage problems={problems} />
        </Examiner>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const {user} = context.query;
  const problems = await getProblems(user);
  return {
    props:{
      problems
    }
  }
}