import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import AddMember from '@components/CompanyGroups/DetailGroup/Member/AddMember';
import { find } from '@libs/client/users';
import { get, getAll } from '@libs/client/developers';

export default function Index({ user, developers }) {
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
        <AddMember user={user || user} developers={developers||developers}/>
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
            const developers = await getAll();
            return {
                props: {
                user,
                developers
                },
            };
        }
      }
      const detailUser = await get(user.id);
      if(detailUser.companies.includes(id))
      {
        const developers = await getAll();
        return {
          props: {
            user,
            developers
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
