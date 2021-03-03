import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import Layout from '../../components/Layout';

import Examination from '../../components/Examinations';
import TopScore from '../../components/TopScore';

const useStyles = makeStyles({
  introBox: {
    backgroundColor: '#960955',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTitle: {
    color: 'white',
    marginTop: 5,
  },
  participateBox: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  participateBtn: {
    position: 'absolute',
    top: -50,
  },
});

export default function Index({exams}) {
  const classes = useStyles();
  const [introHeight, setIntroHeight] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIntroHeight(window.innerWidth / 3);
  }, []);

  return (
    <>
      <Head>
        <title>Examination</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Box style={{ height: introHeight }} className={classes.introBox}>
          <Box style={{ textAlign: 'center' }}>
            <img src="/trophy.png" alt="trophy icon" />
            <Typography variant="h4" className={classes.introTitle}>
              Smart Coder Examination
            </Typography>
          </Box>
        </Box>
        <Box className={classes.participateBox}>
          <Button
            color="primary"
            variant="contained"
            className={classes.participateBtn}
            onClick={handleClickOpen}
          >
            Participate
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Participate Examination
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To participate in the examination, please enter your exam code
                which we sent it to your email.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="examCode"
                label="Exam Code"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary" variant="contained">
                Join
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Grid container direction="row" justify="center" spacing={3}>
            <Grid item sm={5}>
              <Examination exams={exams} />
            </Grid>
            <Grid item sm={4}>
              <TopScore />
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
}
const exams = [
  {
    id: 1,
    title: "Hack the Interview (Vietnam) 1",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 2,
    title: "Hack the Interview (Vietnam) 2",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 3,
    title: "Hack the Interview (Vietnam) 3",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 4,
    title: "Hack the Interview (Vietnam) 4",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 5,
    title: "Hack the Interview (Vietnam) 5",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 6,
    title: "Hack the Interview (Vietnam) 6",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 7,
    title: "Hack the Interview (Vietnam) 7",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 8,
    title: "Hack the Interview (Vietnam) 8",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 9,
    title: "Hack the Interview (Vietnam) 9",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 10,
    title: "Hack the Interview (Vietnam) 10",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 11,
    title: "Hack the Interview (Vietnam) 11",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  },
  {
    id: 12,
    title: "Hack the Interview (Vietnam) 12",
    createdDate: Date.now(),
    duration: "1 h 30 m"
  }
];

export async function getServerSideProps() {

  return {
    props: {
      exams,
    },
  };
}
