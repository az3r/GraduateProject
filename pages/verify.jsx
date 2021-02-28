import * as React from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/auth';
import { FirebaseAuth } from '../libs/firebase_client';
import { getBaseUrl } from '../utils/urls';

export default function AccountVerification({ uid }) {
  const styles = useStyles();
  const router = useRouter();
  const user = {
    email: 'example@email.com',
    uid: 'randomuoid',
  };
  /*
  const user = useAuth();
  React.useEffect(() => {
    if (user) {
      if (user.uid !== uid) {
        // sign out current user
        FirebaseAuth().signOut();
        router.replace('/login');
      } else if (user.emailVerified) {
        router.replace('/');
      }
    } else router.replace('/');
  }, []);
  */
  return (
    <Container className={styles.root}>
      <Grid
        container
        justify="center"
        alignContent="center"
        alignItems="center"
        spacing={4}
        className={styles.grid}
      >
        <Grid item>
          <Typography variant="h3" align="center">
            Verify your account
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            It&apos;s appear that you haven&apos;t verified your account yet. In
            order to use our service, you must first verify your account
          </Typography>
        </Grid>
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <TextField
              type="email"
              contentEditable={false}
              variant="outlined"
              label="Email"
              value={user.email || ''}
              fullWidth
            />
          </Grid>
          <Grid item>
            <VerifyButton />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );

  function VerifyButton() {
    const [resend, setResend] = React.useState(false);
    const [cooldown, setCooldown] = React.useState(0);

    React.useEffect(() => {
      if (cooldown > 0) {
        setTimeout(() => {
          setCooldown(cooldown - 1);
        }, 1000);
      } else {
        // send verification email
      }
    }, [cooldown]);
    return (
      <>
        {resend ? (
          <Button
            startIcon={cooldown <= 0 && <Send />}
            disabled={cooldown > 0}
            variant="contained"
            color={cooldown > 0 ? 'text' : 'primary'}
            fullWidth
            onClick={onVerifyEmail}
          >
            {cooldown > 0
              ? `Please wait for ${cooldown}s...'`
              : 'Resend verification'}
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
      if (!resend) setResend(true);
      setCooldown(60);

      try {
        await FirebaseAuth().currentUser.sendEmailVerification({
          url: `${getBaseUrl()}verify?uid=${user.uid}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

AccountVerification.propTypes = {
  uid: PropTypes.string.isRequired,
};

/*
export async function getServerSideProps({ query }) {
  if (!query.email) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      email: query.email,
    },
  };
}

*/

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
  grid: {
    height: '100%',
  },
}));
