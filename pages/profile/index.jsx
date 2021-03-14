import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { makeStyles, Box, Typography } from '@material-ui/core';
import { useAuth } from '@hooks/auth';
import UserProfileTabs from '@components/UserProfile';
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
  participateBox: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  participateBtn: {
    position: 'absolute',
    top: -50,
  },
  avatar: {
    cursor: 'pointer',
    height: 140,
    width: 140,
    border: '5px solid white',
    borderRadius: 15,
  },
});

export default function Index() {
  const classes = useStyles();
  const user = useAuth();
  const [introHeight, setIntroHeight] = useState(0);

  // test
  // eslint-disable-next-line no-console
  console.log(user);

  useEffect(() => {
    setIntroHeight(window.innerWidth / 6);
  }, []);

  // useEffect(() => {
  //   if(!user){
  //     router.replace("/login");
  //   }
  // }, [user]);
  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Box style={{ height: introHeight }} className={classes.introBox}>
          <Box style={{ textAlign: 'center' }}>
            <img
              className={classes.avatar}
              src={user.photoURL}
              alt="user's profile"
            />
            <Typography variant="h4" className={classes.introTitle}>
              {user.displayName}
            </Typography>
          </Box>
        </Box>
        <Box p={3}>
          <UserProfileTabs />
        </Box>
      </Layout>
    </>
  );
}
