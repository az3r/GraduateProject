import React from 'react';
import Head from 'next/head';
import ExaminationsPage from '@components/Examiner/Examinations';
import { getExams } from '@libs/client/users';
import Examiner from '../../../components/Examiner';
import Layout from '../../../components/Layout';

export default function ExaminerPage({exams}) {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner>
            <ExaminationsPage exams={exams} />
        </Examiner>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const {user} = context.query;
  const exams = await getExams(user);
  return {
    props:{
      exams
    }
  }
}
