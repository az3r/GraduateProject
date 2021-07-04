import React, { useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
// import { useRouter } from 'next/router';
import AppLayout from '@components/Layout';
import { find } from '@libs/client/users';
import {
  get,
  getExamsubmissionForGroup,
  getGroupIds,
} from '@libs/client/developers';
import DetailDevGroup from '@components/CompanyGroups/DetailGroup/Groups/detailDev';
import { useRouter } from 'next/router';

export default function Index({ user, developer, exams, isDev }) {
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
      if (user.role === 'company') {
        if (query.id === user.id) {
          const developer = await get(query.uid);
          const exams = await getExamsubmissionForGroup({
            companyId: query.id,
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
      if (detailUser.companies?.includes(query.id)) {
        const developer = await get(query.uid);
        const exams = await getExamsubmissionForGroup({
          companyId: query.id,
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
      const groups = await getGroupIds(user.id, query.id);
      if (groups.includes(query.idGroup)) {
        const developer = await get(query.uid);
        if (developer.id === user.id) {
          const exams = await getExamsubmissionForGroup({
            companyId: query.id,
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
