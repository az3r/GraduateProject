import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupQuestionsBank from '@components/CompanyGroups/DetailGroup/QuestionsBank';
import { find } from '@libs/client/users';
import { getProblems } from '@libs/client/companies';

export default function Index({ user,questions }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  },[]);
  return (
    <>
      <Head>
        <title>Group questions bank - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup selected={3}>
            <GroupQuestionsBank user={user || user} questions={questions || questions}/>
        </DetailGroup>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id } = query;

      if(user.role === 'company')
      {
        if(id === user.id) 
        {
          const questions = await getProblems(user.id);
          return {
            props: {
              user,
              questions
              },
          };
        }
      }
    }
  }
  return {
    props: {
      user: null,
    },
  };
}
