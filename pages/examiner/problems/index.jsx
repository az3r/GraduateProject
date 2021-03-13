import React from 'react';
import Head from 'next/head';
import ProblemsPage from '@components/Examiner/Problems';
import { getProblems } from '@libs/client/users';
import { parseCookies } from '@libs/client/cookies';
import Layout from '../../../components/Layout';
import Examiner from '../../../components/Examiner';

export default function ExaminerPage({user,problems}) {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner user={user}>
            <ProblemsPage user={user} problems={problems} />
        </Examiner>
      </Layout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  if(Object.keys(cookies).length !== 0)
  {
    const user = JSON.parse(cookies.user);
    const problems = await getProblems(user.uid);
    return {
      props: {
        user,
        problems
      }, 
    }
  }
  return {
    props: {
      user: ""
    }
  }
}