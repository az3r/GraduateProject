import React from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import CompanyGroups from '@components/CompanyGroups';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import { getGroupsDetail } from '@libs/client/companies';
import { get, getCompany } from '@libs/client/developers';

export default function Index({ user, companyGroups }) {
  return (
    <>
      <Head>
        <title>Comapany groups | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <CompanyGroups user={user} companyGroups={companyGroups} />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      if (user.role === 'company') {
        return {
          props: {
            companyGroups: [user],
            user
          },
        };
      }
      const detailUser = await get(user.id);
      const companies = await getGroupsDetail(detailUser.companies);
      const groups = await getCompany(user.id);
      const companyGroups = [...new Set(companies.concat(groups))];
      return {
        props: {
          companyGroups,
          user
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
