import React from 'react';
import Head from 'next/head';
import { Grid } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Problems from '../components/Problems';
import YourProgress from '../components/YourProgress';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
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
            <Grid item xs={8}>
              <Problems />
            </Grid>
            <Grid item xs={4}>
              <YourProgress />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
