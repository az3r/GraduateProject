import {
  Grid,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import PropTypes from 'prop-types';
import * as React from 'react';
import { FirebaseAuth } from '../../libs/firebase_client';
import { getBaseUrl } from '../../utils/urls';

export default function VerifyEmail({ email }) {
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
          Verify Your Account
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          Your new account has been registered successfully, but first you need
          to verify your email before using our service{' '}
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          type="email"
          variant="outlined"
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
}

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
        url: getBaseUrl(),
      });
      await FirebaseAuth().currentUser.reload();
    } catch (error) {
      console.error(error);
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
