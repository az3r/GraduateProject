import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import useStyles from '@styles/auth.style';
import { GitHub, Visibility, VisibilityOff } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as cookies from '@utils/cookies';
import Head from 'next/head';
import { useSnackBar } from '../hooks/snackbar';
import { useAuth } from '../hooks/auth';
import { FirebaseAuth } from '../libs/client/firebase';
import * as authenticate from '../libs/client/authenticate';
import { find } from '../libs/client/users';

const AUTH_PROVIDERS = {
  google: new FirebaseAuth.GoogleAuthProvider(),
  github: new FirebaseAuth.GithubAuthProvider(),
};

export default function Login() {
  const router = useRouter();
  const { update: setUser } = useAuth();
  const { alert } = useSnackBar();
  const styles = useStyles();
  const [form, update] = useState({ password: '', email: '' });
  const [submitting, process] = useState(false);
  const [password, toggle] = useState(true);

  function onSuccess(user) {
    setUser(user);
    cookies.save(user, true);
    const { returnURL } = router.query;
    const destination =
      user.role === 'company'
        ? `/company-groups/${user.id}`
        : `/${returnURL || ''}`;
    router.push(destination);

    alert({
      open: true,
      severity: 'success',
      message: 'Login successfully',
    });
  }

  function onFailure(message) {
    alert({
      open: true,
      severity: 'error',
      message,
    });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      process(true);
      const user = await authenticate.signinWithPassword(form);
      onSuccess(user);
    } catch (error) {
      onFailure(error.code);
    } finally {
      process(false);
    }
  }

  async function signInWithProvider(method) {
    try {
      const credentials = await FirebaseAuth().signInWithPopup(
        AUTH_PROVIDERS[method]
      );
      process(true);

      const user = await find(credentials.user.uid);
      if (user) onSuccess(user);
      else {
        // delete user from firebase auth
        await credentials.user.delete();
        onFailure('auth/user-not-found');
      }
    } catch (error) {
      onFailure(error.code);
    } finally {
      process(false);
    }
  }

  return (
    <>
    <Head>
      <title>Login | Smart Code</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className={styles.root}>
      <Card className={styles.card}>
        <form onSubmit={submit} className={styles.form}>
          <Typography align="center" variant="h3">
            Smart Coder
          </Typography>
          <Box paddingTop={1}>
            <Typography align="center" variant="h4">
              Sign in
            </Typography>
          </Box>
          <TextField
            className={styles.input}
            required
            label="Email"
            aria-label="email"
            name="email"
            type="email"
            onChange={(e) =>
              update((prev) => ({ ...prev, email: e.target.value }))
            }
            value={form.email}
          />
          <TextField
            className={styles.input}
            required
            label="Password"
            aria-label="password"
            name="password"
            type={password ? 'password' : 'text'}
            value={form.password}
            onChange={(e) =>
              update((prev) => ({ ...prev, password: e.target.value }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="show-password-button"
                    edge="end"
                    onClick={() => toggle((prev) => !prev)}
                  >
                    {password ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            disabled={submitting}
            className={styles.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            {!submitting && 'Sign in'}
            {submitting && (
              <CircularProgress style={{ width: 30, height: 30 }} />
            )}
          </Button>
          <Box display="flex" width="100%" justifyContent="center">
            <IconButton onClick={() => signInWithProvider('google')}>
              <img
                width="36px"
                height="36px"
                src="logo_google.webp"
                alt="Google's logo"
              />
            </IconButton>
            <IconButton onClick={() => signInWithProvider('github')}>
              <GitHub style={{ width: 40, height: 40, color: '#000000' }} />
            </IconButton>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingTop={2}
          >
            <Typography align="center">Does not have an account?</Typography>
            <Link href="/register">
              <Button variant="text" color="secondary">
                Register
              </Button>
            </Link>
          </Box>
        </form>
      </Card>
    </div>
    </>
  );
}
