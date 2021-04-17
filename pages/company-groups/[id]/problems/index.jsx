import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { get } from '@libs/client/users';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupQuestions from '@components/CompanyGroups/DetailGroup/Questions';

export default function Index({ user }) {
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Group problems - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup>
            <GroupQuestions/>
        </DetailGroup>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await get(JSON.parse(cookies.user).uid);
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
