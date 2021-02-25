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
import Router from 'next/router';

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
  },
  problemName: {
    paddingLeft: 10,
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
    backgroundColor: 'green',
    fontWeight: 'bolder',
    fontSize: 20,
  },
  startButtonDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  startButton: {
    backgroundColor: 'green',
  },
});

export default function Examination() {
  const classes = useStyles();

  const start = (e) => {
    Router.push('/examination/start');
  };

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Container component={'dev'}>
          <h1>Examination Name</h1>
        </Container>
        <hr />
        <Container component={'dev'}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <h1>Problems</h1>
              <List className={classes.problemList}>
                <Box border={1} className={classes.problemBox}>
                  <h2 className={classes.problemName}>Problem Name</h2>
                  <div className={classes.descriptionDiv}>
                    <div className={classes.decorDiv}>
                      Score: <span className={classes.decorSpan}>100</span>
                    </div>
                    <div className={classes.decorDiv}>
                      Difficulty:{' '}
                      <span className={classes.decorSpan}>Medium</span>
                    </div>
                  </div>
                </Box>
                <Box border={1} className={classes.problemBox}>
                  <h2 className={classes.problemName}>Problem Name</h2>
                  <div className={classes.descriptionDiv}>
                    <div className={classes.decorDiv}>
                      Score: <span className={classes.decorSpan}>100</span>
                    </div>
                    <div className={classes.decorDiv}>
                      Difficulty:{' '}
                      <span className={classes.decorSpan}>Medium</span>
                    </div>
                  </div>
                </Box>
                <Box border={1} className={classes.problemBox}>
                  <h2 className={classes.problemName}>Problem Name</h2>
                  <div className={classes.descriptionDiv}>
                    <div className={classes.decorDiv}>
                      Score: <span className={classes.decorSpan}>100</span>
                    </div>
                    <div className={classes.decorDiv}>
                      Difficulty:{' '}
                      <span className={classes.decorSpan}>Medium</span>
                    </div>
                  </div>
                </Box>
                <Box border={1} className={classes.problemBox}>
                  <h2 className={classes.problemName}>Problem Name</h2>
                  <div className={classes.descriptionDiv}>
                    <div className={classes.decorDiv}>
                      Score: <span className={classes.decorSpan}>100</span>
                    </div>
                    <div className={classes.decorDiv}>
                      Difficulty:{' '}
                      <span className={classes.decorSpan}>Medium</span>
                    </div>
                  </div>
                </Box>
                <Box border={1} className={classes.problemBox}>
                  <h2 className={classes.problemName}>Problem Name</h2>
                  <div className={classes.descriptionDiv}>
                    <div className={classes.decorDiv}>
                      Score: <span className={classes.decorSpan}>100</span>
                    </div>
                    <div className={classes.decorDiv}>
                      Difficulty:{' '}
                      <span className={classes.decorSpan}>Medium</span>
                    </div>
                  </div>
                </Box>
              </List>
            </Grid>
            <Grid item xs={4}>
              <Box
                border={1}
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
                  If you click "Start" button, you will start making the
                  examination. In addion, you won't pause or return the previous
                  question.
                </span>
              </div>
              <div className={classes.startButtonDiv}>
                <Button className={classes.startButton} onClick={start}>
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
