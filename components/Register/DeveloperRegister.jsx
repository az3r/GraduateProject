import * as React from 'react';
import {
  Button,
  Typography,
  Container,
  TextField,
  makeStyles,
  Snackbar,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import { register, existed } from '@libs/client';

export default function DeveloperRegister({ onRegistered }) {
  const styles = useStyles();
  const [waiting, setWaiting] = React.useState(false);
  const [userExisted, setUserExisted] = React.useState(false);
  const [emailExisted, setEmailExisted] = React.useState(false);
  const [strongPassword, setStrongPassword] = React.useState(true);
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
              name="username"
              id="username"
              fullWidth
              helperText={userExisted ? "Username's already existed" : null}
              error={userExisted}
              type="text"
              label="Username"
              variant="filled"
              required
              disabled={waiting}
            />
          </Grid>
          <Grid item>
            <TextField
              name="email"
              id="email"
              fullWidth
              type="email"
              helperText={emailExisted ? "Email's already existed" : null}
              error={emailExisted}
              label="Email"
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
              label="Password"
              error={!strongPassword}
              helperText={strongPassword ? null : 'Weak password'}
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
    const username = form.get('username').trim();
    const email = form.get('email').trim();
    const password = form.get('password').trim();

    validate({ username, email, password }).then((result) => {
      if (result) onRegister({ username, email, password });
    });
  }

  async function validate(form) {
    const isEmailExist = await existed({ email: form.email });
    const isUserExist = await existed({ username: form.username });
    const regex = new RegExp('^(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).{8,}$');
    const isStrongPassword = regex.test(form.password);
    setEmailExisted(isEmailExist);
    setUserExisted(isUserExist);
    setStrongPassword(isStrongPassword);

    // update ui
    return !isEmailExist && !isUserExist && isStrongPassword;
  }

  async function onRegister({ username, email, password }) {
    try {
      setWaiting(true);
      const credentials = await register({ username, email, password });
      onRegistered(credentials.user);
    } catch (error) {
      setSnackBarState({
        open: true,
        severity: 'error',
        message: 'Internal server error',
      });
      setWaiting(false);
    }
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
