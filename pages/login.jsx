import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { FirebaseAuth } from '../libs/firebase_client';
import Head from 'next/head';
import Link from 'next/link';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const config = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'https://graduate-project.vercel.app/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    FirebaseAuth.EmailAuthProvider.PROVIDER_ID,
    FirebaseAuth.GoogleAuthProvider.PROVIDER_ID,
    FirebaseAuth.FacebookAuthProvider.PROVIDER_ID,
    FirebaseAuth.GithubAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: 'https://www.example.com',
  // Privacy policy url.
  privacyPolicyUrl: 'https://www.example.com',
};
export default function Login() {
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));
