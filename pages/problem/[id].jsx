import React from 'react';
import Head from 'next/head';
// import { makeStyles } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { problems as probs, submissions } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';
import Layout from '../../components/Layout';

const TestCode = dynamic(
  () => import('../../components/TestCode'),
  { ssr: false }
);

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

export default function Test({ problem, user, problemSubmissionHistory }) {
  // const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <TestCode problem={problem} user={user} problemSubmissionHistory={problemSubmissionHistory} />
      </Layout>
    </>
  );
}


export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;
  let problemSubmissionHistory = null;
  let item = null;
  try {
    item = await probs.get(params.id);

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
        problemSubmissionHistory = await submissions.getProblemSubmissions(user.uid, params.id);
      }
    }


  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      problem: item,
      user,
      problemSubmissionHistory,
    },
  };
}
