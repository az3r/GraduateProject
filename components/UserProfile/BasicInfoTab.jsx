/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import React from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ChipInput from 'material-ui-chip-input';

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
  formControl: {
    width: 150,
  },
  textField: {
    width: 150,
  },
}));

const without = (array, filtered) => array.filter((element) => element != filtered);

export default function BasicInfoTab() {
  const user = {
    name: 'Thanh Tung Thai',
    email: 'tttung468@gmail.com',
    gender: '',
    location: 'Ho Chi Minh city, Vietnam',
    birthday: '',
    website: 'https://github.com/tttung468',
    education: 'VNUHCM - University of Science - Bachelor',
    work: 'VNUHCM - University of Science - Student',
    technicalSkills: ['C++', 'C', 'Java', 'JavaScript'],
  };

  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: user.name,
    email: user.email,
    gender: user.gender,
    location: user.location,
    birthday: user.birthday,
    website: user.website,
    education: user.education,
    work: user.work,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const [technicalSkills, setTechnicalSkills] = React.useState(user.technicalSkills);
  const handleTechnicalSkillsAdd = (skill) => {
    setTechnicalSkills([...technicalSkills, skill]);
  };
  const handleTechnicalSkillsDelete = (skill) => {
    setTechnicalSkills(without(technicalSkills, skill));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `${values.name}\n${values.email}\n${values.gender}\n${values.location}\n${values.birthday}\n${values.website}\n${values.education}\n${values.work}\n${technicalSkills}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.groupTitle}>
          Basic Information
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Name
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('name')}
                required
                id="nameTextField"
                defaultValue={values.name}
                fullWidth
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
                required
                id="emailTextField"
                defaultValue={values.email}
                fullWidth
              />
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
                  value={values.gender}
                  onChange={handleChange('gender')}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
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
              Location
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('location')}
                required
                id="locationTextField"
                defaultValue={values.location}
                fullWidth
              />
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
                defaultValue={values.birthday}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Website
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('website')}
                required
                id="websiteTextField"
                defaultValue={values.website}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.groupTitle}>
          Experience
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Education
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('education')}
                required
                id="educationTextField"
                defaultValue={values.education}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Work
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                onChange={handleChange('work')}
                required
                id="workTextField"
                defaultValue={values.work}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.groupTitle}>
          Skills
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} className={classes.paper}>
              Technical Skills
            </Grid>
            <Grid item xs={12} sm={9}>
              <ChipInput
                value={technicalSkills}
                fullWidth
                onAdd={(chip) => handleTechnicalSkillsAdd(chip)}
                onDelete={(chip, index) =>
                  handleTechnicalSkillsDelete(chip, index)
                }
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
