/* eslint-disable no-console */
import React from 'react';
import { makeStyles, Grid, Button, Input } from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
  },
  groupTitle: {
    fontWeight: 'bold',
    fontSize: 'large',
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
    width: 150,
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
    <form className={classes.container} onSubmit={handleSubmit}>
      <Grid className={classes.container} container spacing={3}>
        <Grid item xs={12} className={classes.groupTitle}>
          Change Your Password
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Current Password
            </Grid>
            <Grid item xs={12} sm={9}>
              <Input
                id="currentPassword"
                type="password"
                value={values.currentPassword}
                onChange={handleChange('currentPassword')}
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
              <Input
                id="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange('newPassword')}
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
              <Input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Button
          type="submit"
          className={classes.saveButton}
          variant="contained"
          color="secondary"
          startIcon={<SaveOutlinedIcon />}
        >
          Save Changes
        </Button>
      </Grid>
    </form>
  );
}
