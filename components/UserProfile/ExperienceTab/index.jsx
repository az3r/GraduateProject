/* eslint-disable no-lone-blocks */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import {
  makeStyles,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import dateFormat from 'dateformat';
import Popup from '@components/UserProfile/ExperienceTab/Controls/Popup';
import ExperienceForm from '@components/UserProfile/ExperienceTab/Controls/ExperienceForm';

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
    width: 150,
  },
  leftButtonsInDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const experiences = [
  {
    beginDate: '2021-01-01',
    endDate: '2021-02-01',
    company: 'ABC Company',
    title: 'Developer',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'work',
  },
  {
    beginDate: '2020-05-01',
    endDate: '2020-06-01',
    company: 'Xyz Company',
    title: 'Designer',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'work',
  },
  {
    beginDate: '2017-09-01',
    endDate: '2019-12-01',
    company: 'VNUHCM - University of Science',
    title: 'Student',
    description:
      'Lorem ipsum dolor sit amet, nt, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'school',
  },
];

const without = (array, filtered) =>
  array.filter((element) => element != filtered);

export default function ExperiencesTab() {
  const classes = useStyles();
  const [timelineElements, setTimelineElements] = React.useState(experiences);
  const handleTimelineElementsEdit = (elements) => {
    setTimelineElements(elements);
  };
  const handleTimelineElementDelete = (event) => {
    const index = event.currentTarget.value;
    const element = timelineElements[index];
    setTimelineElements(without(timelineElements, element));
  };
  const handleElementAdd = (event) => {
    console.log('Add experience');
  };
  const handleElementEdit = (event) => {
    console.log('Edit experience');
  };

  const [openPopup, setOpenPopup] = React.useState(false);

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
            Work Experience Timeline
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <VerticalTimeline>
            {timelineElements.map((element, index) => {
              const isWorkIcon = element.type === 'work';
              {
                /* const date = `${element.beginDate} - ${element.endDate}`; */
              }
              const formattedBeginDate = dateFormat(
                element.beginDate,
                'mm/yyyy'
              );
              const formattedEndDate = dateFormat(element.endDate, 'mm/yyyy');
              const date = `${formattedBeginDate} - ${formattedEndDate}`;

              return (
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{}}
                  contentArrowStyle={{
                    borderRight: '7px solid  rgb(33, 150, 243)',
                  }}
                  dateClassName="date"
                  date={date}
                  iconStyle={
                    isWorkIcon
                      ? { background: '#06D6A0' }
                      : { background: '#f9c74f' }
                  }
                  icon={isWorkIcon ? <WorkIcon /> : <SchoolIcon />}
                >
                  <div>
                    <h3 className="vertical-timeline-element-title">
                      {element.title}
                    </h3>
                    <h4 className="vertical-timeline-element-subtitle">
                      {element.company}
                    </h4>
                    <p>{element.description}</p>
                  </div>
                  <div className={classes.leftButtonsInDiv}>
                    <IconButton
                      aria-label="delete"
                      value={index}
                      onClick={handleTimelineElementDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      value={index}
                      onClick={setOpenPopup}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                </VerticalTimelineElement>
              );
            })}

            <VerticalTimelineElement
              iconStyle={{ background: '#088247', color: '#fff' }}
              icon={<AddRoundedIcon />}
              iconOnClick={setOpenPopup}
              date="Add New Experience"
            />
          </VerticalTimeline>
        </Grid>
      </Grid>

      {/* Popup Dialog to add new Experience */}
      <Popup
        title="New Experience"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ExperienceForm />
      </Popup>
    </>
  );
}
