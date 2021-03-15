import React from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import Examiner from '../../components/Examiner';
import Layout from '../../components/Layout';

export default function ExaminerPage({user}) {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner user={user}/>
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
      return {
        props: {
          user: JSON.parse(cookies.user)
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