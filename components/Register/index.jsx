import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyles from '@styles/auth.style';
import { GitHub, Visibility, VisibilityOff } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as cookies from '@utils/cookies';
import { useSnackBar } from '@hooks/snackbar';
import { useAuth } from '@hooks/auth';
import { FirebaseAuth } from '@libs/client/firebase';
import * as authenticate from '@libs/client/authenticate';

const AUTH_PROVIDERS = {
  google: new FirebaseAuth.GoogleAuthProvider(),
  github: new FirebaseAuth.GithubAuthProvider(),
};

export default function Register({ type }) {
  const router = useRouter();
  const { update: setUser } = useAuth();
  const { alert } = useSnackBar();
  const styles = useStyles();

  const [form, update] = useState({
    password: '',
    email: '',
    username: '',
    role: type,
  });
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
      message: 'Register successfully',
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
      const user = await authenticate.register({
        ...form,
        role: form.role.toLowerCase(),
      });
      onSuccess(user);
    } catch (error) {
      onFailure(error.code);
    } finally {
      process(false);
    }
  }

  async function registerWithProvider(method) {
    try {
      const credentials = await FirebaseAuth().signInWithPopup(
        AUTH_PROVIDERS[method]
      );
      process(true);

      const user = {
        id: credentials.user.uid,
        email: credentials.user.email,
        username: credentials.user.displayName,
        role: form.role.toLowerCase(),
        avatar: credentials.user.photoURL,
      };
      await authenticate.setupAccount(user);

      onSuccess(user);
    } catch (error) {
      onFailure(error.code);
    } finally {
      process(false);
    }
  }

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <form onSubmit={submit} className={styles.form}>
          <Typography align="center" variant="h3">
            Smart Coder
          </Typography>
          <Box paddingTop={1}>
            <Typography align="center" variant="h4">
              Sign up
            </Typography>
          </Box>
          <TextField
            className={styles.input}
            select
            required
            label="Account's type"
            value={form.role}
            onChange={(e) =>
              update((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            {['Developer', 'Company'].map((option) => (
              <MenuItem key={option} value={option.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={styles.input}
            required
            label="Username"
            aria-label="username"
            name="username"
            type="text"
            onChange={(e) =>
              update((prev) => ({ ...prev, username: e.target.value }))
            }
            value={form.username}
          />
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
            color="secondary"
          >
            {!submitting && 'Register'}
            {submitting && (
              <CircularProgress style={{ width: 30, height: 30 }} />
            )}
          </Button>
          <Box display="flex" width="100%" justifyContent="center">
            <IconButton onClick={() => registerWithProvider('google')}>
              <img
                width="36px"
                height="36px"
                src="/logo_google.webp"
                alt="Google's logo"
              />
            </IconButton>
            <IconButton onClick={() => registerWithProvider('github')}>
              <GitHub style={{ width: 40, height: 40, color: '#000000' }} />
            </IconButton>
          </Box>
        </form>
      </Card>
    </div>
  );
}
