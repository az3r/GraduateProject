import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import {
  get,
  getExamsubmissionForGroup,
  getGroupIds,
} from '@libs/client/developers';
import DetailDevGroup from '@components/CompanyGroups/DetailGroup/Groups/detailDev';

export default function Index({ user, developer, exams, isDev }) {
  console.log(user, developer);
  const router = useRouter();
  const { id, idGroup } = router.query;
  useEffect(() => {
    if (!developer) {
      router.replace(`/company-groups/${id}/groups/${idGroup}`);
    } else if (!user) {
      router.replace('/login');
    }
  },[]);
  return (
    <>
      <Head>
        <title>Groups | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        {developer ? (
          <DetailDevGroup
            user={user}
            developer={developer}
            exams={exams}
            isDev={isDev}
          />
        ) : null}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await find(JSON.parse(cookies.user).uid);
      const { id, uid, idGroup } = query;
      if (user.role === 'company') {
        if (id === user.id) {
          const developer = await get(uid);
          const exams = await getExamsubmissionForGroup({
            companyId: id,
            developerEmail: developer.email,
            developerId: developer.id,
          });
          return {
            props: {
              user,
              developer,
              exams,
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
        const developer = await get(uid);
        const exams = await getExamsubmissionForGroup({
          companyId: id,
          developerEmail: developer.email,
          developerId: developer.id,
        });
        return {
          props: {
            user,
            developer,
            exams,
          },
        };
      }
      const groups = await getGroupIds(user.id, id);
      if (groups.includes(idGroup)) {
        const developer = await get(uid);
        if (developer.id === user.id) {
          const exams = await getExamsubmissionForGroup({
            companyId: id,
            developerEmail: developer.email,
            developerId: developer.id,
          });
          return {
            props: {
              user,
              developer,
              exams,
              isDev: true,
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
