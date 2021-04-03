import React, { useEffect } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Container,
  Grid,
  List,
  Box,
  Button,
} from '@material-ui/core';

import { exams, users } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';
// import { route } from 'next/dist/next-server/server/router';
import { useRouter  } from 'next/router';
import AppLayout from '../../components/Layout';

const useStyles = makeStyles({
  problemList: {
    width: '100%',
    overflow: 'auto',
    maxHeight: '100vh',
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

export default function Introduction({ exam, user }) {
  const classes = useStyles();

  const router = useRouter();

  useEffect(async () => {
    await users.updateScoreExam(user.uid, exam.id, 0);
  }, []);

  const beforeunload = async (event) => {
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave this page?";
    return event.returnValue;
  }

  // const unload = async () => {
  //   await users.updateScoreExam(user.uid, exam.id, 0);
  // }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload);
    // window.addEventListener('unload', unload);
    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      // window.removeEventListener('unload', unload);
    }
  });

  const start = (examId) => {
    // window.onbeforeunload = null;
    // window.onunload = null;

    router.push(`/examination/start/${examId}`);
  }

  return (
    <>
      <Head>
        <title>Examination Introduction</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container component="dev">
          <h1>{exam.title}</h1>
        </Container>
        <hr />
        <Container component="dev">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <h1>Problems</h1>
              <List className={classes.problemList}>
                {exam.problems.map((problem, index) => (
                  <Box
                    tabIndex={index}
                    border={2}
                    className={classes.problemBox}
                  >
                    <Box>
                      {problem.title && (
                        <h2 className={classes.problemName}>{problem.title}</h2>
                      )}
                      {problem.question && (
                        <h2 className={classes.problemName}>
                          Multiple Choice Question
                        </h2>
                      )}
                      <div>
                        <div className={classes.decorDiv}>
                          Score:{' '}
                          <span className={classes.decorSpan}>
                            {problem.score}
                          </span>
                        </div>
                        <div className={classes.decorDiv}>
                          Difficulty:{' '}
                          {/* <span className={classes.decorSpan}>{problem.difficulty}</span> */}
                          {problem.difficulty === 0 && (
                            <Box
                              component="span"
                              display="inline"
                              p="4px"
                              borderRadius={16}
                              color="white"
                              pl={1}
                              pr={1}
                              bgcolor="green"
                            >
                              Easy
                            </Box>
                          )}
                          {problem.difficulty === 1 && (
                            <Box
                              component="span"
                              display="inline"
                              p="4px"
                              borderRadius={16}
                              color="white"
                              pl={1}
                              pr={1}
                              bgcolor="orange"
                            >
                              Medium
                            </Box>
                          )}
                          {problem.difficulty === 2 && (
                            <Box
                              component="span"
                              display="inline"
                              p="4px"
                              borderRadius={16}
                              color="white"
                              pl={1}
                              pr={1}
                              bgcolor="red"
                            >
                              Hard
                            </Box>
                          )}
                        </div>
                      </div>
                    </Box>
                    <Box border={1} className={classes.duration}>
                      {`0${problem.minutes}`.slice(-2)} :{' '}
                      {`0${problem.seconds}`.slice(-2)}
                    </Box>
                  </Box>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box boxShadow={10} className={classes.examinationIntroduction}>
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
                  the examination. In addition, you won&apos;t pause or return
                  the previous question.
                </span>
              </div>
              <div className={classes.startButtonDiv}>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  // href={`/examination/start/${exam.id}`}
                  onClick={() => start(exam.id)}
                >
                  START
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
      }
    }
  }
  catch (e){
    console.log(e);
  }

  const item = await exams.get(params.id, { withProblems: true });
  return {
    props: {
      exam: item,
      user
    },
  };
}
