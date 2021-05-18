import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupExaminations from '@components/CompanyGroups/DetailGroup/Examinations';
import { find } from '@libs/client/users';
import { getExams } from '@libs/client/companies';
import { get } from '@libs/client/developers';

export default function Index({ user, exams }) {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Group examinations - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup selected={4}>
          {exams ? <GroupExaminations user={user} exams={exams} /> : null}
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

      if (user.role === 'company') {
        if (id === user.id) {
          const exams = await getExams(user.id);
          return {
            props: {
              user,
              exams,
            },
          };
        }
        return {
          props: {
            user: null,
          },
        };
      }
      const detailUser = await get(user.id);
      if (detailUser.companies.includes(id)) {
        const exams = await getExams(id);
        return {
          props: {
            user,
            exams,
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
