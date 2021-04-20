import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupQuestionsBank from '@components/CompanyGroups/DetailGroup/QuestionsBank';
import { find } from '@libs/client/users';

export default function Index({ user }) {
  const router = useRouter();

  const questions = [
    {
      id: 1,
      name: "Question 1"
    },
    {
      id: 2,
      name: "Question 2"
    },
    {
      id: 3,
      name: "Question 3"
    },
  ]

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Group questions bank - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup selected={3}>
            <GroupQuestionsBank questions={questions}/>
        </DetailGroup>
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
