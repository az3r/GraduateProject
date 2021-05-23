import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Slide,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { create } from '@libs/client/exams';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditExamination from './EditExamination';

const useStyles = makeStyles({
  displayScrollSpy: {
    position: 'fixed',
    marginRight: '10px',
    marginLeft: '10px',
  },
  contentScrollSpy: {
    color: '#000000',
    fontSize: '13px',
    wordWrap: 'break-word',
    textDecoration: 'none',
  },
  listContentStyle: {
    listStyle: 'none',
    paddingLeft: 15,
  },
  listItem: {
    marginBottom: '10px',
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function AddExamination({ user }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmitExam = async (exam) => {
    const examId = await create(id, exam);
    if (examId !== '') {
      setOpen(true);
    }
  };
  return (
    <Box m={3}>
      <Grid container spacing={2}>
        <Grid item lg={10} md={10}>
          <Breadcrumbs>
            <Link color="inherit" href="/company-groups">
              <Typography className={classes.linkStyle}>
                Company groups
              </Typography>
            </Link>
            <Link color="inherit" href={`/company-groups/${id}`}>
              <Typography className={classes.linkStyle}>
                Current group
              </Typography>
            </Link>
            <Link color="inherit" href={`/company-groups/${id}/examinations`}>
              <Typography className={classes.linkStyle}>
                Examinations
              </Typography>
            </Link>
            <Typography color="textPrimary">Add</Typography>
          </Breadcrumbs>
          <br />
          <Divider />
          <br />
          <EditExamination
            user={user}
            onSubmitExam={onSubmitExam}
            examProp={null}
          />
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <CheckCircleIcon style={{ fontSize: 50, color: '#088247' }} />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Add examination successfully
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Link
                href={`/company-groups/${id}/examinations`}
                style={{ textAlign: 'center' }}
              >
                Back to examinations page
              </Link>
              <Button onClick={handleClose} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item lg={2} md={2}>
          <div className={classes.displayScrollSpy}>
            <Typography variant="h6">Content:</Typography>
            <div className={classes.listContentStyle}>
              <li className={classes.listItem}>
                <a href="#section-20" className={classes.contentScrollSpy}>
                  Enter title
                </a>
              </li>
              <li className={classes.listItem}>
                <a href="#section-21" className={classes.contentScrollSpy}>
                  Enter content
                </a>
              </li>
              <li className={classes.listItem}>
                <a href="#section-22" className={classes.contentScrollSpy}>
                  Enter duration
                </a>
              </li>
              <li className={classes.listItem}>
                <a href="#section-23" className={classes.contentScrollSpy}>
                  Private exam?
                </a>
              </li>
              <li className={classes.listItem}>
                <a href="#section-24" className={classes.contentScrollSpy}>
                  Add questions
                </a>
              </li>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
