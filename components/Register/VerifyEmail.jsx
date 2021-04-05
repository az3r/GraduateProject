import {
  Grid,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import * as React from 'react';
import { auth } from '@libs/client';
import { getBaseUrl } from '@utils/urls';

export default function VerifyEmail({
  displayName,
  uid,
  email,
  emailVerified,
  message,
}) {
  const styles = useStyles();

  return (
    <Grid
      className={styles.root}
      container
      spacing={4}
      direction="column"
      justify="center"
      alignContent="center"
    >
      <Grid item>
        <Typography align="center" variant="h3">
          {emailVerified ? 'Acount alredy verified' : 'Verify Your Account'}
        </Typography>
      </Grid>
      <Grid item>
        {emailVerified ? (
          <Typography>Your account has been verified</Typography>
        ) : (
          <Typography>
            Hello <b>{displayName}</b>, {message}
          </Typography>
        )}
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
        {emailVerified ? (
          <Link href="/">
            <Button variant="contained" color="secondary" fullWidth>
              Back to Dashboard
            </Button>
          </Link>
        ) : (
          <VerifyButton />
        )}
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
        auth.sendVerifyEmail(url);
      } catch (error) {
        // TODO: handler this error
        console.error(error);
      }
    }
  }
}

VerifyEmail.propTypes = {
  displayName: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailVerified: PropTypes.bool.isRequired,
  message: PropTypes.node,
};

VerifyEmail.defaultProps = {
  message: (
    <Typography>
      your new account has been registered successfully, but first you need to
      verify your email before using our service{' '}
    </Typography>
  ),
};
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
}));
