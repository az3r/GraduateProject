import {
  Grid,
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  Container,
} from '@material-ui/core';
import { Send, CheckCircle } from '@material-ui/icons';
import * as React from 'react';

export default function VerifyEmail({ email }) {
  const styles = useStyles();
  const [first, setFirst] = React.useState(true);

  function onSendEmail() {
    setFirst(false);
  }

  return (
    <Container className={styles.root}>
      <Grid container spacing={4} direction="column" justify="center">
        <Grid item>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            color="primary.main"
            borderColor="primary.main"
            border={1}
            p={4}
            width={304}
          >
            <CheckCircle />
            <Box m={1} />
            <Typography variant="h5" align="center">
              Account Successfully Created
            </Typography>
          </Box>
        </Grid>
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <Typography>
              A verification email has been sent to this email address
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              type="email"
              fullWidth
              variant="outlined"
              contentEditable={false}
              value="mycompany@email.com"
            />
          </Grid>

          <Grid item container direction="column" spacing={1}>
            <Grid item>
              <Typography>
                You can skip this step and verify your account later in{' '}
                <b>Profile </b> setting
              </Typography>
            </Grid>
            <Grid item>
              <Box color="error.main">
                <Typography>
                  <b>CAUTIONS: </b> any unverified account will be deleted after{' '}
                  <b>30 days</b>
                </Typography>
              </Box>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item>
                <Button variant="outlined" color="secondary">
                  Take me to Dashboard
                </Button>
              </Grid>
              <Grid item>
                <VerifyButton />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
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
    }
  }, [cooldown]);
  return (
    <>
      {resend ? (
        <Button
          startIcon={<Send />}
          disabled={cooldown > 0}
          variant="contained"
          color={cooldown > 0 ? 'text' : 'primary'}
          onClick={onVerifyEmail}
        >
          Resend {cooldown > 0 ? `${cooldown}s'` : ''}
        </Button>
      ) : (
        <Button color="primary" variant="contained" onClick={onVerifyEmail}>
          Verify now!
        </Button>
      )}
    </>
  );

  function onVerifyEmail() {
    if (!resend) setResend(true);
    setCooldown(5);
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      padding: theme.spacing(5),
      width: '80%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      width: '100%',
    },
  },
  button: {
    width: 128,
  },
}));
