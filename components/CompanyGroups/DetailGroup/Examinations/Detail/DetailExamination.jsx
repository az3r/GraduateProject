import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Paper from '@material-ui/core/Paper';
import { publishExam } from '@libs/client/exams';
import dateFormat from 'dateformat';
import DetailTab from './DetailTab';
import InvitationTab from './InvitationTab';
import ParticipantsTab from './ParticipantsTab';
import CommentsTab from './CommentsTab';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 500,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  steps: {
    position: 'fixed',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 30,
  },
  step: {
    wordWrap: 'break-word',
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function DetailExamination({ user, examProp }) {
  const [value, setValue] = useState(0);
  const [examination, setExamination] = useState(examProp);
  const classes = useStyles();
  const router = useRouter();
  const { id, exam } = router.query;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePublish = async (publish) => {
    await publishExam(exam, publish.startAt, publish.endAt);
    setExamination({
      ...examination,
      published: true,
      startAt: publish.startAt,
      endAt: publish.endAt,
    });
  };

  const handleUnpublish = () => {
    const temp = {...examination};
    delete temp.published;
    delete temp.startAt;
    delete temp.endAt;
    setExamination(temp);
  }

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link color="inherit" href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link color="inherit" href={`/company-groups/${id}/examinations`}>
          <Typography className={classes.linkStyle}>Examinations</Typography>
        </Link>
        <Typography color="textPrimary">Detail</Typography>
      </Breadcrumbs>
      <br/>
      <Divider />
      <br/>
      <Grid container spacing={2}>
        <Grid item lg={10} md={10} sm={10} xs={10}>
          <Box boxShadow={2}>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Detail" />
                <Tab label="Invitation" />
                <Tab label="Participants" />
                <Tab label="Comments" />
              </Tabs>
              <TabPanel value={value} index={0}>
                <DetailTab
                  user={user}
                  examination={examination}
                  handlePublish={handlePublish}
                  handleUnpublish={handleUnpublish}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <InvitationTab examination={examination} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ParticipantsTab examination={examination} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <CommentsTab/>
              </TabPanel>
            </Paper>
          </Box>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Steps examination={examination} />
        </Grid>
      </Grid>
    </Box>
  );
}

function Steps({ examination }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const steps = getSteps();

  useEffect(() => {
    const now = Date.now();
    if (now < examination.startAt) setActiveStep(1);
    if (now >= examination.startAt && now < examination.endAt) setActiveStep(4);
    if (now >= examination.endAt) setActiveStep(5);
  }, [examination]);

  function getSteps() {
    return [
      'Created',
      'Waiting for publishment',
      `Published ${
        examination.startAt
          ? dateFormat(
              new Date(examination.startAt),
              'mmmm dd, yyyy "at" HH:MM TT'
            )
          : ''
      }`,
      'In progress',
      `Finished ${
        examination.endAt
          ? dateFormat(
              new Date(examination.endAt),
              'mmmm dd, yyyy "at" HH:MM TT'
            )
          : ''
      }`,
    ];
  }

  return (
    <Stepper
      color="secondary"
      className={classes.steps}
      activeStep={activeStep}
      orientation="vertical"
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
