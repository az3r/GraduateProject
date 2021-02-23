import React, { useEffect, useState } from 'react';
import Head from "next/head";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';

const TestMCQ = dynamic(
  () => {
    return import('../../../components/TestMCQ');
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

export default function MCQ({problemId, nextProblem}) {
  const classes = useStyles();

  return (
    <>
      <Layout>
        <TestMCQ problemId={problemId} nextProblem={nextProblem}></TestMCQ>
      </Layout>
    </>
  );
}
