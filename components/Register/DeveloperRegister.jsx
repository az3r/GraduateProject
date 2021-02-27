import * as React from 'react';
import {
  Button,
  Typography,
  Container,
  TextField,
  makeStyles,
  Box,
  Snackbar,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import { register } from '../../libs/firebase_client';

export default function DeveloperRegister({ onRegistered }) {
  const styles = useStyles();
  const [waiting, setWaiting] = React.useState(false);
  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
    severity: 'info',
    message: 'No message',
  });
  return (
    <Container className={styles.root}>
      <form onSubmit={onSubmit}>
        <Head>
          <title>Register</title>
          <meta property="og-title" content="Register" />
        </Head>
        <Grid container spacing={4} direction="column" justify="center">
          <Grid item>
            <Typography variant="h4" align="center" className={styles.title}>
              Create Developer Account
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              name="email"
              id="email"
              fullWidth
              type="email"
              className={styles.field}
              label="Email"
              variant="filled"
              required
              disabled={waiting}
            />
          </Grid>
          <Grid item>
            <TextField
              name="username"
              id="username"
              fullWidth
              type="text"
              className={styles.field}
              label="Username"
              variant="filled"
              required
              disabled={waiting}
            />
          </Grid>
          <Grid item>
            <TextField
              name="password"
              id="password"
              fullWidth
              type="password"
              className={styles.field}
              label="Password"
              variant="filled"
              required
              disabled={waiting}
            />
          </Grid>
          <Grid item>
            <TextField
              name="confirmPassword"
              id="confirm-password"
              fullWidth
              type="password"
              className={styles.field}
              label="Confirm Password"
              variant="filled"
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
                  Registering new account, please wait...
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
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Register
                </Button>
              </Grid>
              <Grid item>
                <Link href="/login">
                  <Button
                    className={styles.seperator}
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    href="/login"
                  >
                    I already had an account
                  </Button>
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </form>
      <Snackbar
        open={snackBarState.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackBarState((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <Alert variant="filled" severity={snackBarState.severity}>
          {snackBarState.message}
        </Alert>
      </Snackbar>
    </Container>
  );

  function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const username = form.get('username');
    const email = form.get('email');
    const password = form.get('password');
    onRegister({ username, email, password });
  }

  function onRegister({ username, email, password }) {
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
      if (true) {
        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Register successfully!',
        });
        onRegistered({ email: 'example@eamil.com' });
      } else {
        const { error } = { error: 'invalid-username-password' };
        setSnackBarState({
          open: true,
          severity: 'error',
          message:
            error === 'invalid-username-password'
              ? 'Invalid username or password'
              : 'Internal server error',
        });
      }
    }, 1000);
    /*
    register({
      username,
      email,
      password,
    })
      .then((credentilas) => {
        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Registered successfully!',
        });
        onRegistered(credentilas);
      })
      .catch((error) => {
        setSnackBarState({
          open: true,
          severity: 'error',
          message: 'Internal server error',
        });
      });
      */
  }
}

DeveloperRegister.propTypes = {
  onRegistered: PropTypes.func.isRequired,
};

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
}));
