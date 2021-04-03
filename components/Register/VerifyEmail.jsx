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

export default function VerifyEmail(user) {
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
          {user.emailVerfied ? 'Acount alredy verified' : 'Verify Your Account'}
        </Typography>
      </Grid>
      <Grid item>
        {user.emailVerfied ? (
          <Typography>Your account has been verified</Typography>
        ) : (
          <Typography>
            Hello <b>{user.displayName}</b>, your new account has been
            registered successfully, but first you need to verify your email
            before using our service{' '}
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
          value={user.email}
        />
      </Grid>
      <Grid item>
        {user.emailVerfied ? (
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
        const url = `${getBaseUrl()}verify?uid=${user.uid}`;
        auth.sendVerifyEmail(url);
      } catch (error) {
        // TODO: handler this error
        console.error(error);
      }
    }
  }
}

VerifyEmail.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
}));
