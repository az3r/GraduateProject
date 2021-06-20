import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import React, { useState } from 'react';
import { remove } from '@libs/client/problems';
import ParticipantsTab from './ParticipantsTab';
import DetailTab from './DetailTab';
import CommentsTab from './CommentsTab';

const useStyles = makeStyles({
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});

export default function DetailQuestion({ user, problemProp }) {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const classes = useStyles();

  const router = useRouter();
  const { id, question } = router.query;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAgree = async () => {
    await remove(question);
    setOpen(false);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
    router.replace(`/company-groups/${id}/questions-bank`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/questions-bank`}>
          <Typography className={classes.linkStyle}>Questions bank</Typography>
        </Link>
        <Typography color="textPrimary">Detail</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      {problemProp.isMCQ ? (
        <DetailTab user={user} problemProp={problemProp} />
      ) : (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Detail" />
            <Tab label="Participants" disabled={!problemProp.published} />
            <Tab label="Comments" disabled={!problemProp.published} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <DetailTab user={user} problemProp={problemProp} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ParticipantsTab problemProp={problemProp} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CommentsTab />
          </TabPanel>
        </>
      )}
      <Divider />
      {problemProp.owner === user.id ? (
        <Box m={5} display="flex" justifyContent="center">
          <Button
            onClick={handleClickOpen}
            variant="contained"
            style={{ color: 'red' }}
            startIcon={<DeleteIcon />}
          >
            Delete question
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <ErrorOutlineIcon style={{ fontSize: 50, color: 'red' }} />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Do you want to delete this question?
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
          <Dialog open={open2} onClose={handleClose2}>
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
