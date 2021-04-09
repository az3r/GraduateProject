import React from 'react';
import { problems as probs, users } from '@libs/client';
import PropTypes from 'prop-types';

import Head from 'next/head';
import { Grid, Hidden, Container } from '@material-ui/core';

import Problems from '@components/Problems/index';
import YourProgress from '@components/Problems/YourProgress';
import AppLayout from '@components/Layout';
import { parseCookies } from '@libs/client/cookies';

export default function Home({ problems, user }) {
  return (
    <>
      <Head>
        <title>Smart Coder</title>
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
                <YourProgress user={user} />
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

  try {

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);

        if(user){
          userDetail = await users.get(user.uid);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  const items = await probs.get();
  return {
    props: {
      problems: items,
      user: userDetail
    },
  };
}
