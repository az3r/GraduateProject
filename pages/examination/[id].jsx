import React from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Container,
  Grid,
  List,
  Box,
  Button,
} from '@material-ui/core';

import Layout from '../../components/Layout';

const useStyles = makeStyles({
  problemList: {
    width: '100%',
    overflow: 'auto',
    maxHeight: 450,
  },
  problemBox: {
    height: 100,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
    borderColor: 'green',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  problemName: {
    paddingLeft: 10,
    paddingTop: 0,
    marginTop: 0,
    color: 'green',
  },
  decorDiv: {
    marginLeft: 10,
    display: 'inline',
    fontWeight: 'bolder',
    color: 'gray',
  },
  decorSpan: {
    fontWeight: 'normal',
    color: 'black',
  },
  examinationIntroduction: {
    textAlign: 'center',
    paddingTop: 35,
    paddingBottom: 35,
    borderRadius: 20,
    alignContent: 'center',
    backgroundColor: '#960955',
    color: 'white',
    fontWeight: 'bolder',
    fontSize: 20,
  },
  startButtonDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  duration: {
    marginRight: 25,
    borderRadius: 5,
    padding: 5,
    color: 'red',
    fontWeight: 'bolder',
  },
});

export default function Introduction({problems}) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Examination Introduction</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Container component="dev">
          <h1>Examination Name</h1>
        </Container>
        <hr />
        <Container component="dev">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <h1>Problems</h1>
              <List className={classes.problemList}>
                {
                  problems.map((problem, index) => (
                      <Box tabIndex={index} border={2} className={classes.problemBox}>
                        <Box>
                          <h2 className={classes.problemName}>{problem.title}</h2>
                          <div>
                            <div className={classes.decorDiv}>
                              Score: <span className={classes.decorSpan}>{problem.score}</span>
                            </div>
                            <div className={classes.decorDiv}>
                              Difficulty:{' '}
                              <span className={classes.decorSpan}>{problem.difficulty}</span>
                            </div>
                          </div>
                        </Box>
                        <Box border={1} className={classes.duration}>
                          05:00
                        </Box>
                      </Box>
                    ))
                }
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                boxShadow={10}
                className={classes.examinationIntroduction}
              >
                Examination Introduction
              </Box>
              <hr />
              <div style={{ fontWeight: 'bolder', color: 'blue' }}>
                Time estimated:{' '}
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  120 minutes
                </span>
              </div>
              <div style={{ fontWeight: 'bolder', color: 'blue' }}>
                Note:{' '}
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  If you click &quot;Start&quot; button, you will start making
                  the examination. In addition, you won&apos;t pause or return the
                  previous question.
                </span>
              </div>
              <div className={classes.startButtonDiv}>
                <Button size="large" variant="contained" color="primary" href="/examination/start/1">
                  START
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}

const problems = [
  {
    id: 1,
    title: "Two Sum",
    type: "MCQ",
    duration: "00:30",
    difficulty: "Easy",
    score: 100,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    type: "Code",
    duration: "05:00",
    difficulty: "Medium",
    score: 120,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    type: "MCQ",
    duration: "00:30",
    difficulty: "Easy",
    score: 100,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    type: "Code",
    duration: "05:00",
    difficulty: "Medium",
    score: 120,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    type: "MCQ",
    duration: "00:30",
    difficulty: "Easy",
    score: 100,
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    type: "Code",
    duration: "05:00",
    difficulty: "Medium",
    score: 120,
  },
  {
    id: 7,
    title: "Palindrome Number",
    type: "MCQ",
    duration: "00:30",
    difficulty: "Easy",
    score: 100,
  },
  {
    id: 8,
    title: "Reverse Integer",
    type: "Code",
    duration: "05:00",
    difficulty: "Medium",
    score: 120,
  },
  {
    id: 9,
    title: "String to Integer (atoi)",
    type: "MCQ",
    duration: "00:30",
    difficulty: "Easy",
    score: 100,
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    type: "Code",
    duration: "05:00",
    difficulty: "Medium",
    score: 120,
  },
];

export async function getServerSideProps() {

  return {
    props: {
      problems,
    },
  };
}
