import React from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import CompanyGroups from '@components/CompanyGroups';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import { get } from '@libs/client/developers';
import { getGroupsDetail } from '@libs/client/companies';

export default function Index({ companyGroups }) {
  return (
    <>
      <Head>
        <title>Comapany groups | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <CompanyGroups companyGroups={companyGroups} />
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
            companyGroups: [user],
            },
        };
      }
      const detailUser = await get(user.id);
      const companies = await getGroupsDetail(detailUser.companies);
      return {
        props: {
          companyGroups: companies,
          },
      };
    }
  }
  return {
    props: {
      companyGroups: [],
    },
  };
}
