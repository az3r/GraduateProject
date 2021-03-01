import {
  Grid,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import Link from 'next/link';
import PropTypes from 'prop-types';
import * as React from 'react';
import { sendVerifyEmail } from '@libs/client';
import { getBaseUrl } from '@utils/urls';
import { useAuth } from '@hooks/auth';

export default function VerifyEmail({ email }) {
  const user = useAuth();
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
            Your new account has been registered successfully, but first you
            need to verify your email before using our service{' '}
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
    const [resend, setResend] = React.useState(false);
    const [cooldown, setCooldown] = React.useState(0);

    React.useEffect(() => {
      let timer;
      if (cooldown > 0) {
        timer = setTimeout(() => {
          setCooldown(cooldown - 1);
        }, 1000);
      }
      return clearTimeout(timer);
    }, [cooldown]);
    return (
      <>
        {resend ? (
          <Button
            startIcon={cooldown <= 0 && <Send />}
            disabled={cooldown > 0}
            variant="contained"
            color={cooldown > 0 ? 'default' : 'primary'}
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
        sendVerifyEmail({
          url: `${getBaseUrl()}verify?uid=${user.uid}`,
        });
      } catch (error) {
        // TODO: handler this error
        console.error(error);
      }
    }
  }
}

VerifyEmail.propTypes = {
  email: PropTypes.string.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
}));
