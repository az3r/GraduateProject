import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import { get } from '@libs/client/exams';
import { get as getDev } from '@libs/client/developers';

import dynamic from 'next/dynamic';

const DetailExamination = dynamic(
  () =>
    import(
      '@components/CompanyGroups/DetailGroup/Examinations/Detail/DetailExamination'
    ),
  { ssr: false }
);

export default function Index({ user, examination }) {
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
        {examination ? (
          <DetailExamination user={user} examProp={examination} />
        ) : null}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id, exam } = query;

      if (user.role === 'company') {
        if (id === user.id) {
          const examination = await get({ examId: exam });
          if (examination.companyId === id)
            return {
              props: {
                user,
                examination,
              },
            };
        }
      } else {
        const detailUser = await getDev(user.id);
        if (detailUser.companies.includes(id)) {
          const examination = await get({ examId: exam });
          return {
            props: {
              user,
              examination,
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
