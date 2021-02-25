import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { makeStyles, Grid, Paper } from '@material-ui/core';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';

const TestCode = dynamic(
  () => {
    return import('../../components/TestCode');
  },
  { ssr: false }
);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Test({ problemId }) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <TestCode problemId={problemId}></TestCode>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      problemId: params.id,
    },
  };
}
