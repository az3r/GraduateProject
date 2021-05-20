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
import { signin, signinWithProvider, signout } from '@libs/client/authenticate';
import json2mq from 'json2mq';
import { useAuth } from '@hooks/auth';
import Cookies from 'universal-cookie';

export default function Login() {
  const router = useRouter();
  const styles = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const auth = useAuth();
  const { returnURL } = router.query;

  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
    severity: 'info',
    message: 'No message',
  });

  // prefetch home page
  React.useEffect(() => {
    router.prefetch('/');
  }, []);

  // prefetch home page
  React.useEffect(() => {
    if (auth) {
      // save cookies
      const cookies = new Cookies();
      cookies.set('user', JSON.stringify({ uid: auth.uid, isLogin: true }), {
        path: '/',
      });
      // end save cookies

      if (auth.role === undefined) {
        signout();
        setSnackBarState({
          open: true,
          message: 'Account does not exist',
          severity: 'error',
        });
      } else {
        const destination =
          auth.role === 'company'
            ? `/company-groups/${auth.uid}`
            : `/${returnURL || ''}`;
        router.push(destination);
      }
    }
  }, [auth]);

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
    const [submitting, setSubmitting] = React.useState(false);
    return (
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
              type="email"
              id="email"
              label="Email"
              fullWidth
              name="email"
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
    );

    async function submit(e) {
      e.preventDefault();
      const data = new FormData(e.target);
      const email = data.get('email');
      const password = data.get('password');

      try {
        setSubmitting(true);
        await signInWithEmail({ email, password });

        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Login successfully!',
        });
      } catch (error) {
        const { code } = error;

        setSnackBarState({
          open: true,
          severity: 'error',
          message: code,
        });
        setSubmitting(false);
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
          <Grid item key={item.method}>
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
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    );

    async function onSignin({ method }) {
      try {
        await signInWithProvider({ method });

        setSnackBarState({
          open: true,
          severity: 'success',
          message: 'Login successfully!',
        });
      } catch (error) {
        const { code } = error;

        // only display message if user signs in with username and password
        setSnackBarState({
          open: true,
          severity: 'error',
          message: code,
        });
      }
    }
  }
}

async function signInWithEmail({ email, password }) {
  return signin({ email, password });
}

async function signInWithProvider({ method }) {
  const providers = {
    google: new FirebaseAuth.GoogleAuthProvider(),
    facebook: new FirebaseAuth.FacebookAuthProvider(),
    github: new FirebaseAuth.GithubAuthProvider(),
  };
  return signinWithProvider({ provider: providers[method] });
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
