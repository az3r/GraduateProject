import React from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import { FirebaseAuth, signin } from '../libs/firebase_client';

const providers = {
  google: new FirebaseAuth.GoogleAuthProvider(),
  facebook: new FirebaseAuth.FacebookAuthProvider(),
  github: new FirebaseAuth.GithubAuthProvider(),
};

export default function Login() {
  const router = useRouter();
  const styles = useStyles();
  const [waiting, setWaiting] = React.useState(false);
  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
    severity: 'info',
    message: 'No message',
  });

  // prefetch home page
  React.useEffect(() => {
    router.prefetch('/');
  });

  return (
    <Container className={styles.root}>
      <Head>
        <title>Login</title>
        <meta property="og-title" content="Login" />
      </Head>
      <Typography variant="h2" align="center">
        <b>Smart Coder</b>
      </Typography>
      <form onSubmit={onFormSubmitted}>
        <Grid className={styles.login} spacing={3} container direction="column">
          <Grid item>
            <Typography align="center" variant="h4">
              Sign into Smart Coder
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              type="text"
              id="username"
              label="Username"
              fullWidth
              name="username"
              required
              disabled={waiting}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              id="password"
              type="password"
              label="Password"
              fullWidth
              name="password"
              required
              disabled={waiting}
            />
          </Grid>
          {waiting ? (
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Typography align="center">
                  Signing you in, please wait...
                </Typography>
              </Grid>
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          ) : (
            <>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Sign in
                </Button>
              </Grid>
              <Grid item>
                <Typography align="center">
                  Or choose one of these methods:
                </Typography>
              </Grid>
              <Grid
                container
                item
                direction="column"
                spacing={2}
                justify="center"
              >
                <Grid item>
                  <Button
                    className={styles.google}
                    variant="contained"
                    onClick={() => onSignin({ method: 'google' })}
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
                    className={styles.facebook}
                    onClick={() => onSignin({ method: 'facebook' })}
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
                    className={styles.github}
                    onClick={() => onSignin({ method: 'github' })}
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
              <Grid
                container
                item
                direction="column"
                spacing={1}
                justify="center"
              >
                <Grid item>
                  <Typography align="center">
                    Does not have an account?
                  </Typography>
                </Grid>
                <Grid item>
                  <Link href="/register">
                    <Button variant="contained" color="secondary" fullWidth>
                      Register now!
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackBarState.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackBarState((prev) => ({
            open: false,
            message: prev.message,
            severity: prev.severity,
          }))
        }
      >
        <Alert variant="filled" severity={snackBarState.severity}>
          {snackBarState.message}
        </Alert>
      </Snackbar>
    </Container>
  );

  function onFormSubmitted(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const username = data.get('username');
    const password = data.get('password');

    onSignin({ username, password });
  }

  async function onSignin({ username, password, method }) {
    const provider = method && providers[method];
    try {
      // show loading component only when user signs in with username and password
      if (username && password) {
        setWaiting(true);
      }
      await signin({ username, password, provider });
      router.replace('/');

      setSnackBarState({
        open: true,
        severity: 'success',
        message: 'Login successfully!',
      });
    } catch (failure) {
      const { error } = failure;
      let message;
      if (error.startsWith('invalid')) message = 'Invalid username or password';
      else message = 'Internal server error';

      // only display message if user signs in with username and password
      if (username && password) {
        setSnackBarState({
          open: true,
          severity: 'error',
          message,
        });
        setWaiting(false);
      }
    }
  }
}

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
