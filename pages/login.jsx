import React from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../libs/firebase_client';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));
export default function Login() {
  const router = useRouter();
  const config = {
    callbacks: {
      signInSuccessWithAuthResult() {
        router.push('/');
        return false;
      },
    },
    signInFlow: 'popup',
    signInOptions: [
      FirebaseAuth.GoogleAuthProvider.PROVIDER_ID,
      FirebaseAuth.FacebookAuthProvider.PROVIDER_ID,
      FirebaseAuth.GithubAuthProvider.PROVIDER_ID,
    ],
  };
  const styles = useStyles();
  return (
    <Box className={styles.root}>
      <Head>
        <title>Login</title>
        <meta property="og-title" content="Login" />
      </Head>
      <Typography align="center" variant="h4">
        Sign into your account
      </Typography>
      <StyledFirebaseAuth uiConfig={config} firebaseAuth={FirebaseAuth()} />
      <Typography align="center">Does not have an account?</Typography>
      <Link href="/register">
        <Button variant="text" href="/register">
          Register now!
        </Button>
      </Link>
    </Box>
  );
}
