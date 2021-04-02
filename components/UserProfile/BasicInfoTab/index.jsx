/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Link,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ChipInput from 'material-ui-chip-input';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
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
}));

// create a new array without filtered element
const without = (array, filtered) =>
  array.filter((element) => element != filtered);

export default function BasicInfoTab(props) {
  const classes = useStyles();

  // alert dialog state
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
  const handleOpenAlertDialog = () => {
    setOpenAlertDialog(true);
  };
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  // original user state
  const { user, setUser } = props;

  // user state in this tab
  const [tabUser, setTabUser] = useState(user);
  const handleChange = (prop) => (event) =>
    setTabUser({ ...tabUser, [prop]: event.target.value });

  // technicalSkills state
  const [technicalSkills, setTechnicalSkills] = useState(user.technicalSkills);
  const handleTechnicalSkillsAdd = (skill) => {
    const newTechnicalSkills = [...technicalSkills, skill];
    setTechnicalSkills(newTechnicalSkills);
    setTabUser({ ...tabUser, technicalSkills: newTechnicalSkills });
  };

  const handleTechnicalSkillsDelete = (skill) => {
    const newTechnicalSkills = without(technicalSkills, skill);
    setTechnicalSkills(newTechnicalSkills);
    setTabUser({ ...tabUser, technicalSkills: newTechnicalSkills });
  };

  // use effect when original user changes
  useEffect(() => {
    setTabUser(user);
    setTechnicalSkills(user.technicalSkills);
  }, [user]);

  // website state
  const [website, setWebsite] = useState('');
  const handleChangeWebsiteTxt = (event) => {
    setWebsite(event.target.value);
  };
  const handleAddNewWebsite = () => {
    const removedSpaceStr = website.replace(/\s+/g, ' ').trim();
    const checkArrayIncludesStr = tabUser.websites.includes(removedSpaceStr);
    if (removedSpaceStr != '' && !checkArrayIncludesStr) {
      const newWebsites = [...tabUser.websites, removedSpaceStr];
      setTabUser({ ...tabUser, websites: newWebsites });
    }
  };
  const handleDeleteWebsite = (event) => {
    const index = event.currentTarget.value;
    const newWebsites = without(tabUser.websites, tabUser.websites[index]);
    setTabUser({ ...tabUser, websites: newWebsites });
  };

  // update user
  const handleUpdateUser = () => {
    userServices.update(tabUser);
    setUser(tabUser);
    handleCloseAlertDialog();
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
            Basic Information
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Name
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('name')}
                id="nameTextField"
                value={tabUser.name}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Email
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('email')}
                id="emailTextField"
                value={tabUser.email}
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
              Location
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('location')}
                id="locationTextField"
                value={tabUser.location}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Websites
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={1} style={{ paddingBottom: '8px' }}>
                <Grid item xs={11} sm={11} className={classes.paper}>
                  <TextField
                    onChange={handleChangeWebsiteTxt}
                    id="websiteTextField"
                    fullWidth
                    variant="outlined"
                    placeholder="Example: https://github.com/elon-musk"
                  />
                </Grid>
                <Grid item xs={1} sm={1} className={classes.paper}>
                  <IconButton onClick={handleAddNewWebsite}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {tabUser.websites.map((element, index) => (
                <Grid container spacing={1}>
                  <Grid item className={classes.paper}>
                    <div className={classes.paper}>
                      <Link
                        href={element}
                        target="_blank"
                        style={{ color: '#1890ff' }}
                      >
                        {element}
                      </Link>
                    </div>
                  </Grid>
                  <Grid item className={classes.paper}>
                    <IconButton onClick={handleDeleteWebsite} value={index}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Gender
            </Grid>
            <Grid item xs={12} sm={9}>
              <FormControl className={classes.formControl}>
                <Select
                  value={tabUser.gender}
                  onChange={handleChange('gender')}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>Not provided</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Birthday
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('birthday')}
                id="date"
                type="date"
                value={tabUser.birthday}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography
            style={{
              fontWeight: 'bolder',
              fontSize: 20,
            }}
          >
            Skills
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Technical Skills
            </Grid>
            <Grid item xs={12} sm={9}>
              <ChipInput
                value={technicalSkills}
                onAdd={(chip) => handleTechnicalSkillsAdd(chip)}
                onDelete={(chip, index) =>
                  handleTechnicalSkillsDelete(chip, index)
                }
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>

        <Button
          className={classes.saveButton}
          variant="contained"
          color="primary"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleOpenAlertDialog}
        >
          Save Changes
        </Button>
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
