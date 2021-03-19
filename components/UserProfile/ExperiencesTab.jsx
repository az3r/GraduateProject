/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { makeStyles, Grid, IconButton } from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

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

const experiences = [
  {
    date: '02/2021 - 05/2021',
    company: 'ABC Company',
    title: 'Developer',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'work',
  },
  {
    date: '02/2020 - 05/2020',
    company: 'Xyz Company',
    title: 'Designer',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'work',
  },
  {
    date: '09/2017 - 12/2019',
    company: 'VNUHCM - University of Science',
    title: 'Student',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'school',
  },
];

const without = (array, filtered) => array.filter((element) => element != filtered);

export default function ExperiencesTab() {
  const workIconStyles = { background: '#06D6A0' };
  const schoolIconStyles = { background: '#f9c74f' };
  const classes = useStyles();
  // const [values, setValues] = React.useState({
  //   timelineElements: experiences,
  // });
  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };
  const [timelineElements, setTimelineElements] = React.useState(experiences);
  const handleTimelineElementsEdit = (elements) => {
    setTimelineElements(elements);
  };
  const handleTimelineElementsDelete = (elements) => {
    setTimelineElements(without(timelineElements, elements));
  };
  const handleAddExperience = (event) => {
    console.log('Click add experience');
  };
  const handleDeleteExperience = (event) => {
    const index = event.currentTarget.value;
    console.log(timelineElements[index].title);
    handleTimelineElementsDelete(timelineElements[index]);
    console.log(timelineElements);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.groupTitle}>
        Experiences
      </Grid>
      <Grid item xs={12} className={classes.divider}>
        <VerticalTimeline>
          {timelineElements.map((element, index) => {
            const isWorkIcon = element.type === 'work';

            return (
              <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{}}
                contentArrowStyle={{
                  borderRight: '7px solid  rgb(33, 150, 243)',
                }}
                dateClassName="date"
                date={element.date}
                iconStyle={isWorkIcon ? workIconStyles : schoolIconStyles}
                icon={isWorkIcon ? <WorkIcon /> : <SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title">
                  {element.title}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {element.company}
                </h4>
                <p>{element.description}</p>
                <IconButton
                  aria-label="delete"
                  value={index}
                  onClick={handleDeleteExperience}
                >
                  <DeleteIcon />
                </IconButton>
              </VerticalTimelineElement>
            );
          })}

          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
            icon={<StarIcon />}
            iconOnClick={handleAddExperience}
          />
        </VerticalTimeline>
      </Grid>
    </Grid>
  );
}
