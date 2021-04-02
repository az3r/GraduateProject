import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import { get } from '@libs/client/problems';
import { useRouter } from 'next/router';
import AppLayout from '../../../components/Layout';

const UpdateCodeProblem = dynamic(
  () => import('../../../components/Examiner/Problems/UpdateCodeProblem'),
  { ssr: false }
);

export default function AddProblem({ user, problem }) {
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/login');
    }
    if (Object.keys(problem).length === 0) {
      router.replace('/examiner/problems');
    }
  }, []);
  return (
    <>
      <AppLayout>
        {Object.keys(problem).length !== 0 ? (
          <UpdateCodeProblem user={user} problemProps={problem} />
        ) : null}
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);
  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      const { id } = query;
      const problem = await get(id);
      if (problem) {
        if (user.uid === problem.owner) {
          return {
            props: {
              user,
              problem,
            },
          };
        }
      }
      return {
        props: {
          user,
          problem: '',
        },
      };
    }
  }
  return {
    props: {
      user: '',
      problem: '',
    },
  };
}
