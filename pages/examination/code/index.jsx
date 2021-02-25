import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { makeStyles, Grid, Paper } from '@material-ui/core';
import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';

const TestCode = dynamic(
  () => {
    return import('../../../components/TestCode');
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

export default function Code({ problemId, nextProblem }) {
  const classes = useStyles();

  return (
    <>
      <Layout>
        <TestCode problemId={problemId} nextProblem={nextProblem}></TestCode>
      </Layout>
    </>
  );
}
