import React from 'react';
import { problems as probs, developers } from '@libs/client';
// import PropTypes from 'prop-types';

import Head from 'next/head';
import { Grid, Hidden, Container } from '@material-ui/core';

import Problems from '@components/Problems/index';
import YourProgress from '@components/Problems/YourProgress';
import AppLayout from '@components/Layout';
import { parseCookies } from '@libs/client/cookies';

export default function Problem({ problems, user, solvedProblemsNumber, unsolvedProblemsNumber }) {
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

// Home.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   problems: PropTypes.array.isRequired,
// };

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let solvedProblemsNumber = 0;
  let unsolvedProblemsNumber = 0;

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);


        if(user){
          user = await developers.get(user.uid);

          // Unaccessed forbidden page
          if(user === undefined){
            return {
              redirect: {
                permanent: false,
                destination: "/unaccessed_forbidden"
              }
            }
          }

          // Get solved problems
          const solvedProblems = await developers.getSolvedProblems(user.id);
          solvedProblemsNumber = solvedProblems.length;

          // Get unsolved problems
          const unsolvedProblems = await developers.getUnsolvedProblems(user.id);
          unsolvedProblemsNumber = unsolvedProblems.length;
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
      user,
      solvedProblemsNumber,
      unsolvedProblemsNumber
    },
  };
}
