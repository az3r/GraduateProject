/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '90%',
      margin: theme.spacing(1),
      // padding: 5,
    },
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: theme.spacing(1),
  },
}));

const initialExp = {
  beginDate: '',
  endDate: '',
  company: '',
  title: '',
  description: '',
  type: 'work',
};

export default function ExperienceForm(props) {
  const classes = useStyles();
  const {
    handleAddElement,
    handleEditElement,
    isAddNewExp,
    elementForEdit,
    elementForEditID,
  } = props;

  // experience
  const [experience, setExperience] = React.useState(initialExp);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExperience({
      ...experience,
      [name]: value,
    });
  };

  // use effect when elementForEdit change
  useEffect(() => {
    if (elementForEdit != null) setExperience(elementForEdit);
  }, [elementForEdit]);

  // submit new experience
  const handleSubmit = (event) => {
    event.preventDefault();

    if (isAddNewExp) {
      handleAddElement(experience);
    } else {
      handleEditElement(elementForEditID, experience);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container>
        <Grid item sm={8}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                label="Company"
                name="company"
                value={experience.company}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                label="Title"
                name="title"
                value={experience.title}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                label="Description"
                name="description"
                value={experience.description}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item sm={4}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="select-outlined-label">
                  Experience Type
                </InputLabel>
                <Select
                  labelId="select-outlined-label"
                  label="Experience Type"
                  value={experience.type}
                  name="type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="school">School</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                type="date"
                variant="outlined"
                label="Begin Date"
                name="beginDate"
                value={experience.beginDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                type="date"
                variant="outlined"
                label="End Date"
                name="endDate"
                value={experience.endDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Button
                type="submit"
                className={classes.saveButton}
                color="primary"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
