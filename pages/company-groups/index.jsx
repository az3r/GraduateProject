import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import CompanyGroups from '@components/CompanyGroups';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import { get } from '@libs/client/companies';

export default function Index({ companyGroups }) {
  const router = useRouter();
  useEffect(() => {
    if (companyGroups.length === 0) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Comapany groups - SmartCoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <CompanyGroups companyGroups={companyGroups || companyGroups} />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await get(JSON.parse(cookies.user).uid) || await find(JSON.parse(cookies.user).uid);
      if(user.role === 'company')
      {
        return {
          props: {
            companyGroups: [user],
            },
        };
      }
    }
  }
  return {
    props: {
      companyGroups: [],
    },
  };
}
