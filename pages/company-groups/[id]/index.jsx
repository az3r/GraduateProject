import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupGeneral from '@components/CompanyGroups/DetailGroup/general';
import { find } from '@libs/client/users';

export default function Index({ user }) {
  const router = useRouter();
  useEffect(() => {
    if(!user)
    {
      router.replace("/login");
    }
  },[]);
  return (
    <>
      <Head>
        <title>Group - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup selected={1}>
            <GroupGeneral/>
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
      console.log(user);
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
    }
  }
  return {
    props: {
      user: null,
    },
  };
}
