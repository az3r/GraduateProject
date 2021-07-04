import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import Groups from '@components/CompanyGroups/DetailGroup/Groups';
import { find } from '@libs/client/users';
import { get, getCompanyAndGroup } from '@libs/client/developers';
import { get as getCompany, getGroups } from '@libs/client/companies';

export default function Index({ user, company, groups, isDev }) {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  });
  return (
    <>
      <Head>
        <title>Groups | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <DetailGroup selected={5} isDev={isDev}>
          {groups ? (
            <Groups user={user} company={company} groups={groups} />
          ) : null}
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
          const company = await getCompany(id);
          const groups = await getGroups(id);
          return {
            props: {
              user,
              company,
              isDev: false,
              groups,
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
      if (detailUser.companies?.includes(id)) {
        const company = await getCompany(id);
        const groups = await getGroups(id);
        return {
          props: {
            user,
            company,
            groups,
            isDev: false,
          },
        };
      }
      const groups = await getCompanyAndGroup(user.id, id);
      if (groups.length > 0) {
        return {
          props: {
            user,
            groups,
            isDev: true,
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
