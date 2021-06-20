import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Slide,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import HTMLReactParser from 'html-react-parser';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EditIcon from '@material-ui/icons/Edit';
import HelpIcon from '@material-ui/icons/Help';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import dateFormat from 'dateformat';
import { remove, unpublishExam } from '@libs/client/exams';
import QuestionInfo from '../QuestionInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 700,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabContent: {
    width: '100%',
    overflowY: 'scroll',
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function TabPanel2(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className={classes.tabContent}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function DetailTab({
  user,
  examination,
  handlePublish,
  handleUnpublish,
}) {
  const { startAt } = examination;
  const { endAt } = examination;
  const [open, setOpen] = useState(false);
  const [publish, setPublish] = useState({
    startAt,
    endAt,
  });
  const [message, setMessage] = useState({
    startAt: false,
    endAt: false,
  });
  const [valueTab, setValueTab] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const router = useRouter();
  const { id, exam } = router.query;

  const classes = useStyles();

  const handleChangeStartTime = (e) => {
    if (Date.now() > Date.parse(e.target.value)) {
      setMessage({ ...message, startAt: true });
      return;
    }
    setMessage({ ...message, startAt: false });
    setPublish({ ...publish, startAt: Date.parse(e.target.value) });
  };

  const handleChangeEndTime = (e) => {
    if (publish.startAt >= Date.parse(e.target.value)) {
      setMessage({ ...message, endAt: true });
      return;
    }
    setMessage({ ...message, endAt: false });
    setPublish({ ...publish, endAt: Date.parse(e.target.value) });
  };

  const handlePublishClick = async () => {
    if (publish.startAt === undefined) {
      setMessage({ ...message, startAt: true });
      return;
    }
    if (publish.endAt === undefined) {
      setMessage({ ...message, endAt: true });
      return;
    }
    if (publish.startAt !== undefined && publish.endAt !== '') {
      handlePublish(publish);
      setOpen(false);
    }
  };

  const handleUnpublishClick = async () => {
    await unpublishExam(exam);
    handleUnpublish();
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleClickOpen = () => {
    setOpen2(true);
  };

  const handleAgree = async () => {
    await remove(exam);
    setOpen2(false);
    setOpen3(true);
  };

  const handleClose = () => {
    setOpen2(false);
  };

  const handleClose2 = () => {
    setOpen3(false);
    router.replace(`/company-groups/${id}/examinations`);
  };

  return (
    <Box>
      <Box mb={1} display="flex" justifyContent="flex-end">
        <Tooltip title="Only owner can publish and edit examination">
          <IconButton aria-label="delete">
            <HelpIcon />
          </IconButton>
        </Tooltip>
        <Button
          style={{ marginRight: 10 }}
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          disabled={
            Date.now() >= examination.startAt || examination.owner !== user.id
          }
        >
          Publish examination
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Box>
                <Typography>Publish this examination</Typography>
              </Box>
              <Box m={2} p={1}>
                <Typography>Select start time</Typography>
                <TextField
                  value={
                    publish.startAt
                      ? dateFormat(
                          new Date(publish.startAt),
                          'yyyy-mm-ddXHH:MM'
                        ).replace('X', 'T')
                      : null
                  }
                  onChange={handleChangeStartTime}
                  type="datetime-local"
                  helperText="Start time must be after current time"
                  error={message.startAt}
                />
              </Box>
              <Box m={2} p={1}>
                <Typography>Select end time</Typography>
                <TextField
                  value={
                    publish.endAt
                      ? dateFormat(
                          new Date(publish.endAt),
                          'yyyy-mm-ddXHH:MM'
                        ).replace('X', 'T')
                      : null
                  }
                  onChange={handleChangeEndTime}
                  type="datetime-local"
                  helperText="End time must be after start time"
                  error={message.endAt}
                />
              </Box>
              <Box display="flex" justifyContent="center" p={2}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handlePublishClick}
                >
                  Publish
                </Button>
              </Box>
              {examination.published ? (
                <Box display="flex" justifyContent="center">
                  <Button
                    style={{ backgroundColor: '#FF0505', color: '#ffffff' }}
                    variant="contained"
                    onClick={handleUnpublishClick}
                  >
                    Unpublish
                  </Button>
                </Box>
              ) : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Link href={`/company-groups/${id}/examinations/update?exam=${exam}`}>
          <Button
            variant="contained"
            color="secondary"
            disabled={
              Date.now() >= examination.startAt || examination.owner !== user.id
            }
          >
            Update examination
          </Button>
        </Link>
      </Box>
      <Typography style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}>
        <ScheduleIcon fontSize="small" />
        &nbsp;Created on{' '}
        {dateFormat(
          new Date(examination.createdOn),
          'mmmm dd, yyyy "at" HH:MM TT'
        )}
      </Typography>
      {examination.modifiedAt ? (
        <Typography
          style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
        >
          <EditIcon fontSize="small" />
          &nbsp;Modified on{' '}
          {dateFormat(
            new Date(examination.modifiedAt),
            'mmmm dd, yyyy "at" HH:MM TT'
          )}
        </Typography>
      ) : null}
      <br />
      <Divider />
      <br />
      <Box>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography color="secondary" variant="h4">
            GENERAL INFORMATION SECTION
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={3}>
          {examination.isPrivate ? (
            <Chip color="primary" label="Private" icon={<LockIcon />} />
          ) : (
            <Chip color="primary" label="Public" icon={<PublicIcon />} />
          )}
        </Box>
        <Typography variant="h6">{examination.title}</Typography>
        {HTMLReactParser(examination.content)}
        <Typography>
          <b>Duration:</b> {Math.floor(examination.duration / 60)} minutes{' '}
          {examination.duration % 60} seconds
        </Typography>
        <Typography>
          <b>Score:</b> {examination.score}
        </Typography>
      </Box>
      <br />
      <Divider />
      <br />
      <Box>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography color="secondary" variant="h4">
            QUESTIONS SECTION
          </Typography>
        </Box>
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={valueTab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            {examination.problems.map((item, index) => (
              <Tab label={`Question ${index + 1}`} />
            ))}
          </Tabs>

          {examination.problems.map((item, idx) => (
            <TabPanel2 className={classes.tabPane} value={valueTab} index={idx}>
              <QuestionInfo question={item} noLoadFromDB />
            </TabPanel2>
          ))}
        </div>
      </Box>
      {examination.owner === user.id ? (
        <Box m={5} display="flex" justifyContent="center">
          <Tooltip title="Cannot delete published examination">
            <IconButton aria-label="delete">
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            style={{ color: 'red' }}
            startIcon={<DeleteIcon />}
            disabled={!!examination.published}
          >
            Delete examination
          </Button>
          <Dialog open={open2} onClose={handleClose}>
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <ErrorOutlineIcon style={{ fontSize: 50, color: 'red' }} />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Do you want to delete this examination?
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAgree} color="primary" autoFocus>
                Agree
              </Button>
              <Button onClick={handleClose} color="secondary">
                Disagree
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={open3} onClose={handleClose2}>
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <CheckCircleOutlineIcon
                    style={{ fontSize: 50, color: '#088247' }}
                  />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Delete successfully
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose2} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : null}
    </Box>
  );
}
