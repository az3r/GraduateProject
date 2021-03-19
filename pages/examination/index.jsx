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
import { exams } from '@libs/client';
import Layout from '../../components/Layout';

import Challenge from '../../components/Examinations/Challenge';
import TopScore from '../../components/Examinations/TopScore';


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

export default function Index({examinations, arrProblems}) {
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
              <Challenge exams={examinations} arrProblems={arrProblems} />
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

export async function getServerSideProps() {
  const items = await exams.get("", {withProblems: false});
  const arrProblems = [];
  for(let i = 0; i < items.length; i += 1){
    // const problems = await exams.getProblems(items[i].id)
    arrProblems.push(exams.getProblems(items[i].id));
  }

  return {
    props: {
      examinations: items,
      arrProblems: await Promise.all(arrProblems),
    },
  };
}
