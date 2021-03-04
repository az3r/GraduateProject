import React from 'react';
import Head from 'next/head';
// import { makeStyles } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { problems as probs } from '@libs/client';
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

export default function Test({ problem }) {
  // const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <TestCode problem={problem} />
      </Layout>
    </>
  );
}

// export async function getServerSideProps({ params }) {
//   return {
//     props: {
//       problemId: params.id,
//     },
//   };
// }

export async function getServerSideProps({ params }) {
  try {
    const item = await probs.get(params.id);
    return {
      props: {
        problem: item,
      },
    };
  }catch(e){
    console.log(e);
  }
  const item = await probs.get(params.id);
  return {
    props: {
      problem: item,
    },
  };
}
