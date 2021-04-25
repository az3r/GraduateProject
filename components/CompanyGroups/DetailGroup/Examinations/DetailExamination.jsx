import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Breadcrumbs, Button, Divider, Grid, Slide, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { publishExam } from '@libs/client/exams';
import HTMLReactParser from 'html-react-parser';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EditIcon from '@material-ui/icons/Edit';
import dateFormat from 'dateformat';
import QuestionInfo from './QuestionInfo';

const useStyles = makeStyles((theme)=> ({
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
    position: "fixed",
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 30,
  },
  step: {
    wordWrap: "break-word",
  },
  textFail: {
    color: '#F74B4D',
  },
  displayScrollSpy: {
      position: "fixed",
      marginRight: "10px",
      marginLeft: "10px"
  },
  contentScrollSpy: {
      color: "#000000",
      fontSize: "13px",
      wordWrap: "break-word",
      textDecoration: 'none'
  },
  listContentStyle : {
      listStyle: "none",
      paddingLeft: 15
  },
  listItem: {
      marginBottom: "10px"
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

function TabPanel2(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

export default function DetailExamination({examProp}) {
  const [value, setValue] = useState(0);
  const [examination,setExamination] = useState(examProp);
  const router = useRouter();
  const {id, exam} = router.query;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePublish = async (publish) => {
    await publishExam(exam,publish.startAt,publish.endAt);
    setExamination({...examination, published: true, startAt: publish.startAt, endAt: publish.endAt});
  }

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
            Company groups
        </Link>
        <Link color="inherit" href={`/company-groups/${id}`}>
            Current group
        </Link>
        <Link color="inherit" href={`/company-groups/${id}/examinations`}>
            Examinations
        </Link>
        <Typography color="textPrimary">Detail</Typography>
      </Breadcrumbs>
      <Divider/>
      <Grid container>
        <Grid item lg={10} md={10} sm={10} xs={10}>
          <Box m={3} p={2}>
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
              </Tabs>
              <TabPanel value={value} index={0}>
                <DetailTab examination={examination} handlePublish={handlePublish} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={value} index={2}>
                Item Three
              </TabPanel>
            </Paper>
          </Box>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Steps examination={examination}/>
        </Grid>
      </Grid>
    </Box>
  );
}



function Steps({examination}){

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const steps = getSteps();

  useEffect(()=>{
    const now = Date.now();
    if(now < examination.startAt)
      setActiveStep(1);
    if(now >= examination.startAt && now < examination.endAt)
      setActiveStep(4);
    if(now >= examination.endAt)
      setActiveStep(5);
  },[examination])

  function getSteps() {
    return ['Created','Waiting for publishment' ,
    `Published: ${dateFormat(new Date(examination.startAt),'mmmm dd, yyyy "at" HH:MM TT')}`,
    'In progress', 
    `Finished: ${dateFormat(new Date(examination.endAt),'mmmm dd, yyyy "at" HH:MM TT')}`];
  }

  return(
    <Stepper color="secondary"  className={classes.steps} activeStep={activeStep} orientation="vertical">
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function DetailTab({examination,handlePublish})
{  
  const [open, setOpen] = useState(false);
  const [publish,setPublish] = useState({
    startAt: '',
    endAt: '',
  })
  const [message,setMessage] = useState({
    startAt: false,
    endAt: false
  })
  const [valueTab, setValueTab] = useState(0);
  const router = useRouter();
  const {id, exam} = router.query;

  const classes = useStyles();

  const handleChangeStartTime = (e) => {
    if(Date.now() > Date.parse(e.target.value))
    {
      setMessage({...message, startAt: true});
      return;
    }
    setMessage({...message, startAt: false});
    setPublish({...publish, startAt: Date.parse(e.target.value)})
  }

  const handleChangeEndTime = (e) => {
    if(publish.startAt >= Date.parse(e.target.value))
    {
      setMessage({...message, endAt: true});
      return;
    }
    setMessage({...message, endAt: false});
    setPublish({...publish, endAt: Date.parse(e.target.value)})
  }

  const handlePublishClick = async () => {
    if(publish.startAt === '')
    {
      setMessage({...message, startAt: true});
    }
    if(publish.endAt === '')
    {
      setMessage({...message, endAt: true});
    }
    if(publish.startAt !== '' && publish.endAt !== '')
    {
      handlePublish(publish);
      setOpen(false);
    }
  }

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  return(
    <Box m={3} p={2}>
      <Box mb={1} display="flex" justifyContent="flex-end">
        <Button style={{marginRight: 10}} variant="contained" color="primary" onClick={()=> setOpen(true)} disabled={Date.now() >= examination.startAt}>Publish examination</Button>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <Box >
                      <Typography>Publish this examination</Typography>
                    </Box >
                    <Box m={3} p={2}>
                      <Typography>Select start time</Typography>
                       <TextField 
                        	value={dateFormat(new Date(examination.startAt),'yyyy-mm-ddXHH:MM').replace('X','T')}
                          onChange={handleChangeStartTime} type="datetime-local"
                          helperText="Start time must be after current time"
                          error={message.startAt}/>
                    </Box >
                    <Box m={3} p={2}>
                      <Typography>Select end time</Typography>
                       <TextField 
                          value={dateFormat(new Date(examination.endAt),'yyyy-mm-ddXHH:MM').replace('X','T')}  
                          onChange={handleChangeEndTime} type="datetime-local"
                          helperText="End time must be after start time"
                          error={message.endAt}/>
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <Button color="primary" variant="contained" onClick={handlePublishClick}>Publish</Button>
                    </Box >
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> setOpen(false)} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <Link href={`/company-groups/${id}/examinations/update?exam=${exam}`}><Button variant="contained" color="secondary" disabled={Date.now() >= examination.startAt}>Update examination</Button></Link>
      </Box> 
      <Typography style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}}><ScheduleIcon fontSize="small"/>&nbsp;Created on {dateFormat(new Date(examination.createdOn),'mmmm dd, yyyy "at" HH:MM TT')}</Typography>
      <Typography style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}}><EditIcon fontSize="small"/>&nbsp;Modified on {dateFormat(new Date(examination.modifiedAt),'mmmm dd, yyyy "at" HH:MM TT')}</Typography>
      <Divider/>  
      <Typography>Title</Typography>
      <Typography>{examination.title}</Typography>
      {
        HTMLReactParser(examination.content)
      }
      <Typography>Duration: {Math.floor(examination.duration / 60)} minutes {examination.duration % 60} seconds</Typography>
      <Typography>Score: {examination.score}</Typography>
      <Divider/>  
      <div className={classes.root}>
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={valueTab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
        >
          {
              examination.problems.map((item,index)=>(
                  <Tab 
                    label={`Question ${index+1}`} 
                  />
              ))
          }
        </Tabs>

        {
          examination.problems.map((item,idx)=>(
              <TabPanel2 className={classes.tabPane} value={valueTab} index={idx}>
                  <QuestionInfo question={item}/>
              </TabPanel2>
          ))
        }
      </div>
    </Box>
  );
}