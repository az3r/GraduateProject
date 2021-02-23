import {
  Grid,
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Send, Done, CheckCircle, Warning } from '@material-ui/icons';
import * as React from 'react';

export default function VerifyEmail({ email }) {
  const styles = useStyles();
  const [first, setFirst] = React.useState(true);

  function onSendEmail() {
    setFirst(false);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={1}
      className={styles.root}
    >
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
      <Box p={3}>
        <Typography>
          A verification email has been sent to this email address
        </Typography>
        <Box mb={1}>
          <TextField
            type="email"
            fullWidth
            variant="filled"
            label="Email"
            contentEditable={false}
            value="mycompany@email.com"
          />
        </Box>

        <Typography>
          You can skip this step and verify your account later in{' '}
          <b>Profile </b> setting
        </Typography>
        <Box color="error.main">
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Warning />
            </Grid>
            <Grid item>
              <Typography>
                <b>CAUTIONS: </b> any unverified account will be deleted after{' '}
                <b>30 days</b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {first ? (
        <Button color="primary" variant="contained" onClick={onSendEmail}>
          Got it! Send me email
        </Button>
      ) : (
        <ResendButton className={styles.button} />
      )}
    </Box>
  );
}

function ResendButton() {
  const [remain, setRemain] = React.useState(5);
  const props = {
    disabled: remain > 0,
    color: 'primary',
    variant: 'contained',
  };
  React.useEffect(() => {
    const timer = setInterval(() => {
      setRemain((prev) => {
        console.log(prev);
        if (prev <= 0) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  }, []);
  return (
    <Button {...props} startIcon={<Send />}>
      Resend {remain <= 0 ? '' : `${remain}s'`}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    width: 128,
  },
}));
