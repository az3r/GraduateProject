import React from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import { FirebaseAuth } from '@libs/client/firebase';
import { auth } from '@libs/client';
import { useCookies } from 'react-cookie';
import json2mq from 'json2mq';
import { getBaseUrl } from '@utils/urls';

export default function Login() {
  const router = useRouter();
  const styles = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
    severity: 'info',
    message: 'No message',
  });
  const [, setCookies] = useCookies(['user']);

  // prefetch home page
  React.useEffect(() => {
    router.prefetch('/');
  });

  return (
    <Box className={styles.root}>
      <Head>
        <title>Login</title>
        <meta property="og-title" content="Login" />
      </Head>
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
      {smUp ? <LoginSMUp /> : <LoginSMDown />}
    </Box>
  );
  /** login for screen <= 600 */
  function LoginSMDown() {
    return (
      <>
        <Typography variant="h2" align="center">
          <b>Smart Coder</b>
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          marginTop={theme.spacing(0.5)}
        >
          <Box display="flex" flexGrow={3} justifyContent="center">
            <Box width="78%">
              <EmailForm />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexGrow={5}
            marginTop="2em"
          >
            <Box width="78%">
              <ProviderSignin />
            </Box>
          </Box>
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          marginTop={theme.spacing(0.5)}
        >
          <Box width="80%">
            <Link href="/register">
              <Button variant="contained" color="secondary" fullWidth>
                Register
              </Button>
            </Link>
          </Box>
        </Box>
      </>
    );
  }

  /** login for screen > 600 */
  function LoginSMUp() {
    const width970 = useMediaQuery(
      json2mq({
        maxWidth: 970,
      })
    );
    return (
      <Box maxWidth="1440px" margin="auto">
        <Typography variant="h2" align="center">
          <b>Smart Coder</b>
        </Typography>
        <Box display="flex" marginTop={theme.spacing(1)}>
          <Box display="flex" flexGrow={3} justifyContent="center">
            <Box width="80%" maxWidth="560px">
              <EmailForm />
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexGrow={5}
            marginTop="2em"
          >
            <Box width={width970 ? '80%' : '60%'} maxWidth="560px">
              <ProviderSignin />
            </Box>
          </Box>
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          marginTop={theme.spacing(1)}
        >
          <Box width="50%">
            <Link href="/register">
              <Button variant="contained" color="secondary" fullWidth>
                Register
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  function EmailForm() {
    const [verification, setVerification] = React.useState(undefined);
    const [submitting, setSubmitting] = React.useState(false);
    return (
      <>
        {verification ? (
          <EmailVerification
            email={verification.email}
            uid={verification.uid}
            username={verification.username}
          />
        ) : (
          <form onSubmit={submit}>
            <Grid spacing={3} container direction="column">
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
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </Grid>
              {submitting ? (
                <SubmittingProgress />
              ) : (
                <Grid item>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Signin
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </>
    );

    async function submit(e) {
      e.preventDefault();
      const data = new FormData(e.target);
      const username = data.get('username');
      const password = data.get('password');

      try {
        setSubmitting(true);
        await signInWithEmail({ username, password });

        // save cookies
        const user = {
          uid: FirebaseAuth().currentUser.uid,
          isLogin: true,
        };
        setCookies(['user'], JSON.stringify(user), { path: '/' });
        // end save cookies

        router.replace('/');
        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Login successfully!',
        });
      } catch (error) {
        const { code } = error;

        // handle email not verified
        if (code === 'email_not_verified') {
          setVerification({ user: error.user });
          return;
        }

        let message;
        if (code?.startsWith('auth/')) message = 'Invalid username or password';
        else message = 'Internal server error';

        // only display message if user signs in with username and password
        setSnackBarState({
          open: true,
          severity: 'error',
          message,
        });
        setSubmitting(false);
      }
    }
  }

  function EmailVerification({ user }) {
    const { username, uid, email } = user;
    return (
      <Grid container alignContent="center" spacing={2} direction="column">
        <Grid item>
          <Typography>
            Hello <b>{username}</b>, you must verify your email before using our
            service
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            type="email"
            variant="outlined"
            label="Email"
            fullWidth
            contentEditable={false}
            value={email}
          />
        </Grid>
        <Grid item>
          <VerifyButton />
        </Grid>
      </Grid>
    );
    function VerifyButton() {
      const [cooldown, setCooldown] = React.useState(0);
      const [waiting, setWaiting] = React.useState(false);

      React.useEffect(() => {
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 0) setWaiting(false);
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }, []);
      return (
        <>
          {waiting ? (
            <Button disabled variant="contained" color="default" fullWidth>
              Please wait for {cooldown} seconds...
            </Button>
          ) : (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={onVerifyEmail}
            >
              Verify email
            </Button>
          )}
        </>
      );

      async function onVerifyEmail() {
        // update ui
        setCooldown(60);
        setWaiting(true);

        try {
          const url = `${getBaseUrl()}verify?uid=${uid}`;
          auth.sendVerifyEmail(user, url);
        } catch (error) {
          // TODO: handler this error
          console.error(error);
        }
      }
    }
  }

  function SubmittingProgress() {
    return (
      <Grid item container justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography align="center">Signing you in, please wait...</Typography>
        </Grid>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  function ProviderSignin({ disabled = false }) {
    const items = [
      {
        className: styles.google,
        method: 'google',
        title: 'Sign in with Google',
        alt: "google's logo",
        src: '/logo_google.webp',
        color: undefined,
        disabled,
      },
      {
        className: styles.facebook,
        method: 'facebook',
        title: 'Sign in with Facebook',
        alt: "facebook's logo",
        src: '/logo_facebook.webp',
        color: 'primary',
        disabled: false,
      },
      {
        className: styles.github,
        method: 'github',
        title: 'Sign in with Github',
        alt: "github's logo",
        src: '/logo_github.webp',
        color: 'primary',
        disabled,
      },
    ];
    return (
      <Grid container item direction="column" spacing={3} justify="center">
        <Grid item>
          <Typography align="center">
            Or choose the following methods
          </Typography>
        </Grid>
        {items.map((item) => (
          <Grid item>
            <Button
              className={item.className}
              variant="contained"
              color={item.color}
              disabled={item.disabled}
              onClick={() => onSignin({ method: item.method })}
              fullWidth
              startIcon={
                <Avatar className={styles.logo} alt={item.alt} src={item.src} />
              }
            >
              Sign in with Google
            </Button>
          </Grid>
        ))}
      </Grid>
    );

    async function onSignin({ method }) {
      try {
        const { credential } = await signInWithProvider({ method });

        // save cookies
        const user = {
          uid: credential.user.uid,
          isLogin: true,
        };
        setCookies(['user'], JSON.stringify(user), { path: '/' });
        // end save cookies

        router.replace('/');
        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Login successfully!',
        });
      } catch (error) {
        const { code } = error;

        let message;
        if (code?.contain('auth/')) message = 'Invalid username or password';
        else message = 'Internal server error';

        // only display message if user signs in with username and password
        setSnackBarState({
          open: true,
          severity: 'error',
          message,
        });
      }
    }
  }
}

async function signInWithEmail({ username, password }) {
  const credentials = await auth.signin({ username, password });
  if (!credentials.user.emailVerified) {
    await auth.signout();
    return Promise.reject({
      code: 'email_not_verified',
      user: credentials.user,
    });
  }
  return credentials;
}

async function signInWithProvider({ method }) {
  const providers = {
    google: new FirebaseAuth.GoogleAuthProvider(),
    facebook: new FirebaseAuth.FacebookAuthProvider(),
    github: new FirebaseAuth.GithubAuthProvider(),
  };
  return auth.signinWithProvider({ provider: providers[method] });
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 0),
  },
  emailForm: {
    flexGrow: 4,
    padding: theme.spacing(0, 2),
  },
  providerSignin: {
    flexGrow: 3,
    padding: theme.spacing(0, 2),
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
