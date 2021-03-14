import React from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import Layout from '../../../components/Layout';

const UpdateCodeProblem  = dynamic(
  () => import('../../../components/Examiner/Problems/UpdateCodeProblem'),
  { ssr: false });

export default function AddProblem({user}) {
  return (
    <>
      <Layout>
        <UpdateCodeProblem user={user} />
      </Layout>
    </>
  );
}

export async function getServerSideProps({req,params}) {
  const cookies = parseCookies(req);
  console.log(params.id);
  if(Object.keys(cookies).length !== 0)
  {
    if(cookies.user)
    {
      const user = JSON.parse(cookies.user);
      return {
        props: {
          user,
        }, 
      }
    }
  }
  return {
    props: {
      user: ""
    }
  }
}
