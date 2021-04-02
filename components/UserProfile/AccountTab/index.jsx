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

export default function AccountTab() {
  const user = {
    password: '123456',
  };

  const classes = useStyles();
  const [values, setValues] = React.useState({
    currentPassword: user.password,
    newPassword: '',
    confirmPassword: '',
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `${values.currentPassword}\n${values.newPassword}\n${values.confirmPassword}`
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
            Change Your Password
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Current Password
            </Grid>
            <Grid item xs={12} sm={9}>
              {/* <Input
                id="currentPassword"
                type="password"
                value={values.currentPassword}
                onChange={handleChange('currentPassword')}
                variant="outlined"
              /> */}
              <TextField
                type="password"
                className={classes.textField}
                onChange={handleChange('currentPassword')}
                value={values.currentPassword}
                autoComplete="current-password"
                variant="outlined"
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
              {/* <Input
                id="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange('newPassword')}
              /> */}
              <TextField
                type="password"
                className={classes.textField}
                onChange={handleChange('newPassword')}
                autoComplete="new-password"
                variant="outlined"
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
              {/* <Input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
              /> */}
              <TextField
                type="password"
                className={classes.textField}
                onChange={handleChange('confirmPassword')}
                autoComplete="confirm-password"
                variant="outlined"
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
