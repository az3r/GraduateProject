import React from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import Layout from '../../../components/Layout';

const AddExamProblem = dynamic(
  () => import('../../../components/Examiner/Examinations/AddExamProblem')
  ,
  { ssr: false });

export default function AddProblem({user}) {
  return (
    <>
      <Layout>
        <AddExamProblem user={user} />
      </Layout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
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

