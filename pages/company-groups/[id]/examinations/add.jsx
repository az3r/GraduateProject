import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import dynamic from 'next/dynamic';
import { find } from '@libs/client/users';
import { get } from '@libs/client/developers';

const AddExamination = dynamic(
  () => import('@components/CompanyGroups/DetailGroup/Examinations/AddExamination'),
  { ssr: false }
);

export default function Index({ user }) {
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Add questions - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <AddExamination user={user}/>
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
          return {
            props: {
              user,
              },
          };
        }
      }
      const detailUser = await get(user.id);
      if(detailUser.companies.includes(id))
      {
        return {
          props: {
            user,
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
