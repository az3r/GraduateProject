import React from 'react';

import Head from 'next/head';
import {Container } from '@material-ui/core';

import AppLayout from '@components/Layout';

export default function Ranking() {
  return (
    <>
      <Head>
        <title>Ranking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container>
          <div>Hello</div>
        </Container>
      </AppLayout>
    </>
  );
}
