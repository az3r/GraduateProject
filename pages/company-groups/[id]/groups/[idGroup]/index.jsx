import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import DetailGroup from '@components/CompanyGroups/DetailGroup/Groups/detail';
import { find } from '@libs/client/users';
import { get, getGroupIds } from '@libs/client/developers';
import { getGroup, getInvitableDeveloperForGroup } from '@libs/client/companies';

export default function Index({ user, group, developers, isDev }) {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
    if (!group) {
      router.replace(`/company-groups/${id}/groups`);
    }
  });
  return (
    <>
      <Head>
        <title>Groups | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        {group ? <DetailGroup user={user} group={group} developers={developers} isDev={isDev}/> : null}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id, idGroup } = query;
      if (user.role === 'company') {
        if (id === user.id) {
          const group = await getGroup({ companyId: id, groupId: idGroup });
          const developers = await getInvitableDeveloperForGroup({companyId: id, groupId: idGroup });
          return {
            props: {
              user,
              group,
              developers
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
        const group = await getGroup({ companyId: id, groupId: idGroup });
        const developers = await getInvitableDeveloperForGroup({companyId: id, groupId: idGroup });
        return {
          props: {
            user,
            group,
            developers
          },
        };
      }
      const groups = await getGroupIds(user.id, id);
      if (groups.includes(idGroup)) {
        const group = await getGroup({ companyId: id, groupId: idGroup });
        return {
          props: {
            user,
            group,
            isDev: true,
            developers: []
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
