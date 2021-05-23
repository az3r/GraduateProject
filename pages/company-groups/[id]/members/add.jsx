import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import AddMember from '@components/CompanyGroups/DetailGroup/Member/AddMember';
import { find } from '@libs/client/users';
import { get, getAll } from '@libs/client/developers';
import {
  get as getCompany,
  getDeveloperNotInGroup,
} from '@libs/client/companies';

export default function Index({ user, developers }) {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
    if (!developers) {
      router.replace(`/company-groups/${id}/members`);
    }
  });
  return (
    <>
      <Head>
        <title>Group Members | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        {developers ? <AddMember user={user} developers={developers} /> : null}
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
          const developers = company.members
            ? await getDeveloperNotInGroup(company)
            : await getAll();
          return {
            props: {
              user,
              developers,
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
        return {
          props: {
            user,
            developers: null,
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
