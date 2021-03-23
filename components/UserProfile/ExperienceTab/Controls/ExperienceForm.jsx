/* eslint-disable no-unused-vars */
import React from 'react';
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
import { useForm, Form } from '@components/UserProfile/ExperienceTab/Controls/useForm';

const useStyles = makeStyles((theme) => ({
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: theme.spacing(1),
  },
}));

const initialFValues = {
  // beginDate: '2021-01-01',
  // endDate: '2021-02-01',
  // company:
  //   'Vietnam National University Ho Chi Minh City - University of Science',
  // title: 'Chief Executive Officer',
  // description:
  //   'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
  // type: 'work',
  beginDate: '',
  endDate: '',
  company: '',
  title: '',
  description: '',
  type: 'work',
};

export default function ExperienceForm() {
  const classes = useStyles();
  const { values, setValues, handleInputChange } = useForm(initialFValues);

  return (
    <Form>
      <Grid container>
        <Grid item sm={8}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                label="Company"
                name="company"
                value={values.company}
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
                value={values.title}
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
                value={values.description}
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
              <TextField
                type="date"
                variant="outlined"
                label="Begin Date"
                name="beginDate"
                value={values.beginDate}
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
                value={values.endDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="select-outlined-label">
                  Experience Type
                </InputLabel>
                <Select
                  labelId="select-outlined-label"
                  label="Experience Type"
                  value={values.type}
                  name="type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="school">School</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Button
                type="submit"
                className={classes.saveButton}
                color="primary"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
              >
                Add New
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}
