/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Typography,
  Link,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { useAuth } from '@hooks/auth';
import * as userServices from '@libs/client/users';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
  },
  paper: {
    padding: theme.spacing(1),
    color: 'theme.palette.text.secondary',
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  divider: {
    border: '1px solid white',
    borderBottomColor: '#eeeeee',
  },
  // textField: {
  //   width: 250,
  // },
}));

export default function AccountTab(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState } = props;
  const [checkEmailSent, setCheckEmailSent] = React.useState(false);
  const [link, setLink] = React.useState('');

  // user get from useAuth()
  const auth = useAuth();

  useEffect(async () => {
    if (auth) {
      if (auth.role === 'developer')
        setLink(`${window.location.origin}/profile/dev/${auth.uid}`);
      else setLink(`${window.location.origin}/profile/co/${auth.uid}`);
    }
  }, [auth]);

  // submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await userServices.sendPasswordResetEmail(
        auth.email,
        `${window.location.origin}/login`
      );
      setCheckEmailSent(true);

      setSnackBarState({
        open: true,
        severity: 'success',
        message: 'sent email successfully!',
      });
    } catch (err) {
      console.log(err);
      setSnackBarState({
        open: true,
        severity: 'error',
        message: err.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography
            style={{
              fontWeight: 'bolder',
              fontSize: 20,
            }}
          >
            Your Account
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2} style={{ height: 80 }}>
              Link
            </Grid>
            <Grid item xs={12} sm={10}>
              <Link href={link} target="_blank" style={{ color: '#1890ff' }}>
                {link}
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              Email
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                id="emailTextField"
                value={user.email}
                className={classes.textField}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.divider}
          style={{ marginTop: 15 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2} />
            <Grid item xs={12} sm={10}>
              <Button
                type="submit"
                className={classes.saveButton}
                color="primary"
                variant="contained"
                startIcon={<EmailIcon />}
                disabled={checkEmailSent}
              >
                Send a password reset link to my email.
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
