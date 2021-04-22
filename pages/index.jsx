import React from 'react';
import { problems as probs, developers } from '@libs/client';
import PropTypes from 'prop-types';

import Head from 'next/head';
import { Grid, Hidden, Container } from '@material-ui/core';

import Problems from '@components/Problems/index';
import YourProgress from '@components/Problems/YourProgress';
import AppLayout from '@components/Layout';
import { parseCookies } from '@libs/client/cookies';

export default function Home({ problems, user, solvedProblemsNumber, unsolvedProblemsNumber }) {
  return (
    <>
      <Head>
        <title>Problems | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            />
            <Grid item xs={12} md={8} lg={8}>
              <Problems problems={problems} />
            </Grid>
            <Hidden smDown>
              <Grid item xs={false} md={4} lg={4}>
                <YourProgress user={user} problemsNumber={problems.length} solvedProblemsNumber={solvedProblemsNumber} unsolvedProblemsNumber={unsolvedProblemsNumber} />
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

Home.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  problems: PropTypes.array.isRequired,
};

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let userDetail = null;
  let solvedProblemsNumber = 0;
  let unsolvedProblemsNumber = 0;

  try {

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);


        if(user){
          userDetail = await developers.get(user.uid);


          // Get solved problems
          const solvedProblems = await developers.getSolvedProblems(user.uid);
          solvedProblemsNumber = solvedProblems.length;


          const allProblemSubmissions = await developers.getAllProblemSubmissions(user.uid);
          const unsolvedSubmittedProblems = allProblemSubmissions.filter(
            (problem) => {
              let isAccepted = false;
              for(let i = 0; i < solvedProblems.length; i += 1){
                if (solvedProblems[i].id === problem.problemId) {
                  isAccepted = true;
                  break;
                }
              }

              if(isAccepted === false && problem.status !== "Accepted"){
                return problem;
              }
              return null;
            });

          const unsolvedSubmittedProblemsDump = [];
          for(let i = 0; i < unsolvedSubmittedProblems.length; i += 1) {
            let flag = false;
            for(let j = 0; j < unsolvedSubmittedProblemsDump.length; j += 1) {
              if(unsolvedSubmittedProblems[i].problemId === unsolvedSubmittedProblemsDump[j].problemId){
                flag = true;
                break;
              }
            }
            if(flag === false){
              unsolvedSubmittedProblemsDump.push(unsolvedSubmittedProblems[i]);
            }
          }
          unsolvedProblemsNumber = unsolvedSubmittedProblemsDump.length;
        }

      }
    }
  } catch (e) {
    console.log(e);
  }

  const items = await probs.getPublishedProblems();

  return {
    props: {
      problems: items,
      user: userDetail,
      solvedProblemsNumber,
      unsolvedProblemsNumber
    },
  };
}
