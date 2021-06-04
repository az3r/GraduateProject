import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Box,
  Typography,
  Grid,
} from '@material-ui/core';
import { exams, developers } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';

import TopScore from '@components/Examinations/TopScore';
import Challenge from '../../components/Examinations/Challenge';
import Layout from '../../components/Layout';


const useStyles = makeStyles({
  introBox: {
    backgroundColor: '#960955',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTitle: {
    color: 'white',
    marginTop: 5,
  },
});

export default function Index({user, examinations, usersExamScore}) {
  const classes = useStyles();

  const [introHeight, setIntroHeight] = useState(0);

  useEffect(() => {
    setIntroHeight(window.innerWidth / (7/2));
  }, []);


  return (
    <>
      <Head>
        <title>Examination | Smart Code</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Box style={{ height: introHeight}} className={classes.introBox}>
          <Box style={{ textAlign: 'center' }}>
            <img src="/trophy.png" alt="trophy icon" />
            <Typography variant="h4" className={classes.introTitle}>
              Smart Coder Examination
            </Typography>
          </Box>
        </Box>
        <Box m={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Challenge user={user} exams={examinations} />
            </Grid>
            <Grid item xs={12} md={4}>
               <TopScore usersExamScore={usersExamScore} />
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let joinedExams = [];
  let items = [];

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);

        if(user) {
          user = await developers.get(user.uid);

          // Unaccessed forbidden page
          if (user === undefined) {
            return {
              redirect: {
                permanent: false,
                destination: "/unaccessed_forbidden"
              }
            }
          }

          joinedExams = await developers.getJoinedExams(user);
        }
        else {
          return {
            redirect: {
              permanent: false,
              destination: "/login"
            }
          }
        }
      }
      else {
        return {
          redirect: {
            permanent: false,
            destination: "/login"
          }
        }
      }
    }
    else {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      }
    }
  }
  catch (e){
    console.log(e);
  }

  items = await exams.getPublishedExams();

  if(joinedExams !== null){
    for(let i = 0; i < items.length; i += 1){
      items[i].isJoined = false;
      for(let j = 0; j < joinedExams.length; j += 1){
        if(items[i].id === joinedExams[j].id){
          items[i].isJoined = true;
          break;
        }
      }
    }
  }


  // Get users score for TOP SCORE
  const usersExamScore = await developers.getUserByExamScore();
  return {
    props: {
      user,
      examinations: items,
      usersExamScore
    },
  };
}
