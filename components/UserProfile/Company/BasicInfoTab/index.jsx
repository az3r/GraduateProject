/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
} from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ChipInput from 'material-ui-chip-input';
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
  formControl: {
    width: 250,
  },
  textField: {
    width: 250,
  },
  textarea: {
    resize: 'both',
  },
}));

// create a new array without filtered element
const without = (array, filtered) =>
  array.filter((element) => element != filtered);

export default function BasicInfoTab(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState, isOnlyWatch } = props;

  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
  const handleOpenAlertDialog = () => {
    setOpenAlertDialog(true);
  };
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  // user state in this tab
  const [tabUser, setTabUser] = useState(user);
  const handleChangeTabUser = (prop) => (event) =>
    setTabUser({ ...tabUser, [prop]: event.target.value });

  // specialties state
  const [specialties, setSpecialties] = useState(user.specialties);
  const handleAddSpecialties = (skill) => {
    const lowerCaseStr = skill.toLowerCase();

    // check array includes lowerCaseStr, return true if string is found
    const checkIncludesStr = specialties.includes(lowerCaseStr);

    if (!checkIncludesStr) {
      const newSpecialties = [...specialties, skill];
      setSpecialties(newSpecialties);
      setTabUser({ ...tabUser, specialties: newSpecialties });
    }
  };
  const handleDeleteSpecialties = (skill) => {
    const newSpecialties = without(specialties, skill);
    setSpecialties(newSpecialties);
    setTabUser({ ...tabUser, specialties: newSpecialties });
  };

  // use effect when original user changes
  useEffect(() => {
    setTabUser(user);
    setSpecialties(user.specialties);
  }, [user]);

  // update user
  const handleUpdateUser = async () => {
    handleCloseAlertDialog();

    try {
      await userServices.update(tabUser);
      setUser(tabUser);
      setSnackBarState({
        open: true,
        severity: 'success',
        message: 'Update successfully!',
      });
    } catch (err) {
      console.log(err);
      setSnackBarState({
        open: true,
        severity: 'error',
        message: 'Internal server error',
      });
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography
            style={{
              fontWeight: 'bolder',
              fontSize: 20,
            }}
          >
            Overview
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Introduction
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChangeTabUser('introduction')}
                id="introductionTextField"
                value={tabUser.introduction}
                fullWidth
                variant="outlined"
                multiline
                inputProps={{ className: classes.textarea }}
                disabled={isOnlyWatch}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Name
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChangeTabUser('name')}
                id="nameTextField"
                value={tabUser.name}
                fullWidth
                variant="outlined"
                disabled={isOnlyWatch}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Website
            </Grid>
            <Grid item xs={11} sm={9}>
              {isOnlyWatch ? (
                <div className={classes.paper}>
                  <Link
                    href={tabUser.website}
                    target="_blank"
                    style={{ color: '#1890ff' }}
                  >
                    {tabUser.website}
                  </Link>
                </div>
              ) : (
                <TextField
                  onChange={handleChangeTabUser('website')}
                  id="websiteTextField"
                  value={tabUser.website}
                  fullWidth
                  variant="outlined"
                  placeholder="E.g: https://www.hcmus.edu.vn/"
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Industry
            </Grid>
            <Grid item xs={11} sm={9}>
              <TextField
                onChange={handleChangeTabUser('industry')}
                id="industryTextField"
                value={tabUser.industry}
                fullWidth
                variant="outlined"
                placeholder={
                  isOnlyWatch
                    ? ''
                    : 'E.g: Higher Education, Internet, Information Technology, Services...'
                }
                disabled={isOnlyWatch}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Headquarter
            </Grid>
            <Grid item xs={11} sm={9}>
              <TextField
                onChange={handleChangeTabUser('headquarter')}
                id="headquarterTextField"
                value={tabUser.headquarter}
                fullWidth
                variant="outlined"
                disabled={isOnlyWatch}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Specialties
            </Grid>
            <Grid item xs={12} sm={9}>
              <ChipInput
                value={specialties}
                onAdd={(chip) => handleAddSpecialties(chip)}
                onDelete={(chip, index) => handleDeleteSpecialties(chip, index)}
                fullWidth
                variant="outlined"
                disabled={isOnlyWatch}
              />
            </Grid>
          </Grid>
        </Grid>

        {isOnlyWatch ? null : (
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleOpenAlertDialog}
          >
            Save Changes
          </Button>
        )}
      </Grid>

      <Dialog
        open={openAlertDialog}
        onClose={handleCloseAlertDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
