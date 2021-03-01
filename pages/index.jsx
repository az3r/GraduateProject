import React from 'react';
import { problems as probs } from '@libs/client';
import PropTypes from 'prop-types';

import Head from 'next/head';
import { Grid, Hidden, Container } from '@material-ui/core';

import Problems from '@components/Problems/index';
import YourProgress from '@components/YourProgress';
import Layout from '@components/Layout';

export default function Home({ problems }) {
  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
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
                <YourProgress />
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}

Home.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  problems: PropTypes.array.isRequired,
};

export async function getServerSideProps() {
  const items = await probs.get();

  return {
    props: {
      problems: items,
    },
  };
}
