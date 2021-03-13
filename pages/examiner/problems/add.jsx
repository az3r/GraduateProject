import React from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import Layout from '../../../components/Layout';

const AddCodeProblem = dynamic(
  () => import('../../../components/Examiner/Problems/AddCodeProblem'),
  { ssr: false });

export default function AddProblem({user}) {
  return (
    <>
      <Layout>
        <AddCodeProblem user={user} />
      </Layout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  if(Object.keys(cookies).length !== 0)
  {
    const user = JSON.parse(cookies.user);
    return {
      props: {
        user,
      }, 
    }
  }
  return {
    props: {
      user: ""
    }
  }
}
