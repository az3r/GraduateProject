import React from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import { get } from '@libs/client/problems';
import Layout from '../../../components/Layout';

const UpdateCodeProblem  = dynamic(
  () => import('../../../components/Examiner/Problems/UpdateCodeProblem'),
  { ssr: false });

export default function AddProblem({user,problem}) {
  return (
    <>
      <Layout>
        <UpdateCodeProblem user={user} problemProps={problem} />
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
      user: ""
    }
  }
}
