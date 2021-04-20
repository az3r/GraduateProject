import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { find } from '@libs/client/users';
import Examiner from '../../components/Examiner';
import AppLayout from '../../components/Layout';

export default function ExaminerPage({ user }) {
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
        <Examiner />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      if(user.role === 'company')
      {
        return {
          props: {
            user: JSON.parse(cookies.user),
            },
        };
      }
    }
  }
  return {
    props: {
      user: '',
    },
  };
}
