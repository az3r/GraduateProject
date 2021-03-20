import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import { get } from '@libs/client/problems';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';

const DetailProblem  = dynamic(
  () => import('../../../components/Examiner/Problems/DetailProblem'),
  { ssr: false });

export default function ProblemDetail({user,problem}) {
  const router = useRouter();
    useEffect(() => {
        if(Object.keys(user).length === 0)
        {
        router.replace('/login');
        }
        if(Object.keys(problem).length === 0)
        {
        router.replace('/examiner/problems');
        }
    },[]);
  return (
    <>
      <Layout>
        {
          Object.keys(problem).length !== 0 ?
          <DetailProblem user={user} problem={problem} />
          : null
        }
      </Layout>
    </>
  );
}

export async function getServerSideProps({req,query}) {
  const cookies = parseCookies(req);
  if(Object.keys(cookies).length !== 0)
  {
    if(cookies.user)
    {
      const user = JSON.parse(cookies.user);
      const {id} = query;
      const problem = await get(id);
      if(problem)
      {
        if(user.uid === problem.owner)
        {
          return {
            props: {
              user,
              problem
            }, 
          }
        }
      }
      return {
          props: {
              user,
              problem: ""
          }
      }
    }
  }
  return {
    props: {
      user: "",
      problem: ""
    }
  }
}
