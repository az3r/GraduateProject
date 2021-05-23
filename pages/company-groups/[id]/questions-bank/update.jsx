import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import { get as getDev } from '@libs/client/developers';

import dynamic from 'next/dynamic';
import { get } from '@libs/client/problems';

const UpdateQuestion = dynamic(
  () =>
    import(
      '@components/CompanyGroups/DetailGroup/QuestionsBank/UpdateQuestion'
    ),
  { ssr: false }
);

export default function Index({ user, problem }) {
  const router = useRouter();
  const { id, question } = router.query;

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
    if (!problem) {
      router.replace(
        `/company-groups/${id}/questions-bank/detail?question=${question}`
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Group Questions Bank | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        {problem ? <UpdateQuestion user={user} problemProp={problem} /> : null}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id, question } = query;

      if (user.role === 'company') {
        if (id === user.id) {
          const problem = await get({ problemId: question });
          if (problem.owner === user.id)
            return {
              props: {
                user,
                problem,
              },
            };
          return {
            props: {
              user,
              problem: null,
            },
          };
        }
        return {
          props: {
            user: null,
          },
        };
      }
      const detailUser = await getDev(user.id);
      if (detailUser.companies.includes(id)) {
        const problem = await get({ problemId: question });
        if (problem.owner === detailUser.id)
          return {
            props: {
              user,
              problem,
            },
          };
        return {
          props: {
            user,
            problem: null,
          },
        };
      }
    }
  }
  return {
    props: {
      user: null,
    },
  };
}
