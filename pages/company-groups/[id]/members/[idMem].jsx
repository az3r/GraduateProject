import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailMember from '@components/CompanyGroups/DetailGroup/Member/DetailMember';
import { find } from '@libs/client/users';
import {
  get,
  getExams as getDevExams,
  getProblems as getDevProblems,
} from '@libs/client/developers';
import { CircularProgress } from '@material-ui/core';

export default function Index({ user, questions, exams }) {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Group members - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        {!user ? (
          <CircularProgress />
        ) : (
          <DetailMember questions={questions} exams={exams} />
        )}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id, idMem } = query;
      let questions = [];
      let exams = [];
      if (user.role === 'company') {
        if (id === user.id) {
          questions = await getDevProblems(id, idMem);
          exams = await getDevExams(id, idMem);
          return {
            props: {
              user,
              questions,
              exams,
            },
          };
        }
      }
      const detailUser = await get(user.id);
      if (detailUser.companies.includes(id)) {
        questions = await getDevProblems(id, idMem);
        exams = await getDevExams(id, idMem);
        return {
          props: {
            user,
            questions,
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
