import React, { useEffect } from 'react';
import Head from 'next/head';
import ProblemsPage from '@components/Examiner/Problems';
import { getProblems } from '@libs/client/users';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '../../../components/Layout';
import Examiner from '../../../components/Examiner';

export default function ExaminerPage({ user, problems }) {
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <Examiner user={user}>
          <ProblemsPage user={user} problems={problems} />
        </Examiner>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      const problems = await getProblems(user.uid);
      return {
        props: {
          user,
          problems,
        },
      };
    }
  }
  return {
    props: {
      user: '',
      problems: '',
    },
  };
}
