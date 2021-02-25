import React from 'react';
import {
  Avatar,
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import Head from 'next/head';
import clsx from 'clsx';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      padding: theme.spacing(5),
      width: 512,
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      width: '100%',
    },
  },
  login: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  logo: {
    width: 32,
    height: 32,
  },
  noTransform: {
    textTransform: 'none',
  },
  google: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  github: {
    backgroundColor: '#212121',
    '&:hover': {
      backgroundColor: 'black',
    },
  },
  facebook: {
    color: theme.palette.background,
    backgroundColor: '#4267b2',
    '&:hover': {
      backgroundColor: '#003d82',
    },
  },
}));
export default function Login() {
  const router = useRouter();
  const styles = useStyles();
  return (
    <Container className={styles.root}>
      <Head>
        <title>Login</title>
        <meta property="og-title" content="Login" />
      </Head>
      <Typography variant="h2" align="center">
        <b>Smart Coder</b>
      </Typography>
      <Grid className={styles.login} spacing={3} container direction="column">
        <Grid item>
          <Typography align="center" variant="h4">
            Sign into Smart Coder
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            variant="filled"
            label="Username"
            fullWidth
            name="username"
          />
        </Grid>
        <Grid item>
          <TextField
            variant="filled"
            label="Password"
            fullWidth
            name="password"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" fullWidth>
            Sign in
          </Button>
        </Grid>
        <Grid item>
          <Typography align="center">
            Or choose one of these methods:
          </Typography>
        </Grid>
        <Grid container item direction="column" spacing={2} justify="center">
          <Grid item>
            <Button
              className={clsx(styles.noTransform, styles.google)}
              variant="contained"
              fullWidth
              startIcon={
                <Avatar
                  className={styles.logo}
                  alt="Google's logo"
                  src="/logo_google.webp"
                />
              }
            >
              Sign in with Google
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={clsx(styles.noTransform, styles.facebook)}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                <Avatar
                  className={styles.logo}
                  alt="Facebook's logo"
                  src="/logo_facebook.webp"
                />
              }
            >
              Sign in with Facebook
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={clsx(styles.noTransform, styles.github)}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                <Avatar
                  className={styles.logo}
                  alt="Github's logo"
                  src="/logo_github.webp"
                />
              }
            >
              Sign in with Github
            </Button>
          </Grid>
        </Grid>
        <Grid container item direction="column" spacing={1} justify="center">
          <Grid item>
            <Typography align="center">Does not have an account?</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" fullWidth>
              Register now!
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
