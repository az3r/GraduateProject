import {
  Box,
  Button,
  Container,
  Link as MaterialLink,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import FirebaseAuth from "../libs/firebase_client";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useAuth } from "../hooks/auth";

const uiconfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return true;
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    FirebaseAuth.EmailAuthProvider.PROVIDER_ID,
    FirebaseAuth.GoogleAuthProvider.PROVIDER_ID,
    FirebaseAuth.FacebookAuthProvider.PROVIDER_ID,
    FirebaseAuth.GithubAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "https://www.example.com",
  // Privacy policy url.
  privacyPolicyUrl: "https://www.example.com",
};

export default function Login() {
  const styles = useStyles();
  const user = useAuth();
  return (
    <>
      <Head>
        <title>Login</title>
        <meta property="og-title" content="Login" />
      </Head>
      {user ? SignedIn() : Guest()}
    </>
  );

  // Displayed content guest
  function Guest() {
    return (
      <Box className={styles.root}>
        <Typography align="center" variant="h4">
          Sign into your account
        </Typography>
        <StyledFirebaseAuth uiConfig={uiconfig} firebaseAuth={FirebaseAuth()} />
        <Typography align="center">
          Does not have an account?
          <Box style={{ marginLeft: "0.5em" }}>
            <Link href="/register">
              <MaterialLink underline="hover" href="/register">
                Register now!
              </MaterialLink>
            </Link>
          </Box>
        </Typography>
      </Box>
    );
  }

  // Displayed content for signed in user
  function SignedIn() {
    return (
      <Container className={styles.root}>
        <Paper className={styles.paper}>
          <Typography align="center" variant="h4">
            You are already signed in
          </Typography>
          <Link href="/">
            <Button
              href="/"
              variant="contained"
              color="primary"
              className={styles.button}
            >
              Go to home
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
    width: 480,
  },
}));
