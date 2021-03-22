/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { makeStyles, Box } from '@material-ui/core';
import { useAuth } from '@hooks/auth';
import UserAvatar from '@components/UserProfile/UserAvatar';
import UserProfileTabs from '@components/UserProfile';
import Layout from '../../components/Layout';

const useStyles = makeStyles({
  introBox: {
    backgroundColor: '#960955',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participateBox: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  participateBtn: {
    position: 'absolute',
    top: -50,
  },
});

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  console.log(cookies.user);

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      return {
        props: {
          user: JSON.parse(cookies.user),
        },
      };
    }
  }
  return {
    props: {
      user: '',
    },
  };
}

export default function Index({ user }) {
  const classes = useStyles();
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/login');
    }
  });

  const [introHeight, setIntroHeight] = useState(0);
  useEffect(() => {
    setIntroHeight(window.innerWidth / 5);
  }, []);

  if (!user || !useAuth()) {
    return null;
  }
  console.log(user);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Box style={{ height: introHeight }} className={classes.introBox}>
          <UserAvatar user={useAuth()}/>
        </Box>
        <Box p={3}>
          <UserProfileTabs />
        </Box>
      </Layout>
    </>
  );
}
