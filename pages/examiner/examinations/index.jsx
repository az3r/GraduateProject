import React, { useEffect } from 'react';
import Head from 'next/head';
import ExaminationsPage from '@components/Examiner/Examinations';
import { getExams } from '@libs/client/users';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import Examiner from '../../../components/Examiner';
import Layout from '../../../components/Layout';

export default function ExaminerPage({user,exams}) {
  const router = useRouter();
  useEffect(()=>{
    if(Object.keys(user).length === 0)
    {
      router.replace("/login");
    }
  })
  return (
    <>
      <Head>
        <title>HCMUSCoder - Examiner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Examiner user={user}>
            <ExaminationsPage exams={exams} />
        </Examiner>
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
      const exams = await getExams(user.uid);
      return {
        props: {
          user,
          exams
        }, 
      }
    }
  }
  return {
    props: {
      user: "",
      exams: ""
    }
  }
}
