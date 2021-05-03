import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup';
import GroupMember from '@components/CompanyGroups/DetailGroup/Member';
import { find } from '@libs/client/users';
import { get } from '@libs/client/developers';
import { get as getCompany } from '@libs/client/companies';


export default function Index({ user, company }) {
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
        <DetailGroup selected={2}>
            <GroupMember company={company}/>
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

      if(user.role === 'company')
      {
        if(id === user.id) 
        {
          const company = await getCompany(id);
          return {
            props: {
              user,
              company
              },
          };
        }
      }
      const detailUser = await get(user.id);
      if(detailUser.companies.includes(id))
      {
        const company = await getCompany(id);
        return {
          props: {
            user,
            company
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
