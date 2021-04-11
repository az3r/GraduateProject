/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

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
  textField: {
    width: 250,
  },
}));

export default function AccountTab(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState } = props;
  const [strongPassword, setStrongPassword] = React.useState(true);

  // passwords state
  const [passwords, setPasswords] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const handleChangePasswords = (prop) => (event) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  // submit
  const handleSubmit = (event) => {
    event.preventDefault();

    // const isValidCurrentPass = checkCurrentPass(passwords.currentPassword);
    console.log(
      `cur: ${passwords.currentPassword}
      new: ${passwords.newPassword}
      confirm: ${passwords.confirmPassword}`
    );
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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Email
            </Grid>
            <Grid item xs={12} sm={9}>
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
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Current Password
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                type="password"
                name="currentPassword"
                className={classes.textField}
                onChange={handleChangePasswords('currentPassword')}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              New Password
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                type="password"
                name="newPassword"
                className={classes.textField}
                onChange={handleChangePasswords('newPassword')}
                autoComplete="new-password"
                variant="outlined"
                required
                error={!strongPassword}
                helperText={strongPassword ? null : 'Weak password'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Confirm Password
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                type="password"
                name="confirmPassword"
                className={classes.textField}
                onChange={handleChangePasswords('confirmPassword')}
                autoComplete="confirm-password"
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        </Grid>

        <Button
          type="submit"
          className={classes.saveButton}
          color="primary"
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
        >
          Save Changes
        </Button>
      </Grid>
    </form>
  );
}
