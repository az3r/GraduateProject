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
  InputLabel,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { exams, users } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { useRouter } from 'next/router';
import TopScore from '../../components/Examinations/TopScore';
import Challenge from '../../components/Examinations/Challenge';
import Layout from '../../components/Layout';


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
  margin: {
    margin: 1,
  },
  textField: {
    width: '100%',
  },
});

export default function Index({user, examinations}) {
  const classes = useStyles();
  const router = useRouter();

  const [introHeight, setIntroHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [values, setValues] = React.useState({
    examId: '',
    password: '',
    showPassword: false,
    note: '',
  });

  const MySwal = withReactContent(Swal);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoin = async () => {
    if(user) {
      // If ExamId empty
      if (values.examId === '') {
        setValues({ ...values, note: "Exam ID is not valid!" });
        return;
      }
      // Get all joined exams by user
      const joinedExam = await users.getJoinedExams(user.uid);

      let isJoined = false;
      // Check whether user have participated?
      for (let i = 0; i < joinedExam.length; i += 1) {
        if (joinedExam[i].id === values.examId) {
          isJoined = true;
          break;
        }
      }

      if (isJoined) {
        setValues({ ...values, note: "You have participated this exam!" });
      } else {
        // Get exam by examId
        const participatedExam = await exams.get(values.examId, { withProblems: false });

        // Check whether exam exist?
        if (participatedExam.createdOn === null) {
          setValues({ ...values, note: "This exam don't exist!" });

        }  // Check whether exam have expired?
        else if (Date.parse(participatedExam.startAt) <= Date.now() && Date.parse(participatedExam.endAt) >= Date.now()) {
          // If participated exam is not private
          if (participatedExam.isPrivate === false) {
            await users.joinExam(user.uid, participatedExam.id);
            router.push(`/examination/${participatedExam.id}`);
          } else if (participatedExam.password === values.password) {
            await users.joinExam(user.uid, participatedExam.id);
            router.push(`/examination/${participatedExam.id}`);
          } else {
            setValues({ ...values, note: "Password is not valid!" });
          }
        } else {
          setValues({ ...values, note: "This exam have expired or have not started yet!" });
        }
      }
    }
    else{
      setOpen(false);
      MySwal.fire({
        title: <p>You have not logged in yet, please log into your account!</p>,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then((result) => {
        if(result.isConfirmed){
          router.push('/login');
        }
      });
    }
  };

  useEffect(() => {
    setIntroHeight(window.innerWidth / (7/2));
  }, []);


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
            maxWidth="xs"
          >
            <DialogTitle id="form-dialog-title">
              Participate Examination
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To participate in the examination, please enter your EXAM ID and EXAM CODE
                which we sent it to your email.
              </DialogContentText>
              {
                values.note !== '' &&
                  <h3 style={{color: 'red'}}>Note: {values.note}</h3>
              }
              <TextField
                autoFocus
                margin="dense"
                id="examCode"
                label="Exam ID"
                type="text"
                value={values.examId}
                onChange={handleChange('examId')}
                fullWidth
              />
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button onClick={handleJoin} color="primary" variant="contained">
                Join
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Grid container direction="row" justify="center" spacing={3}>
            <Grid item sm={5}>
              <Challenge user={user} exams={examinations} />
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

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let joinedExams = null;

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);

        joinedExams = await users.getJoinedExams(user.uid);
        // console.log(joinedExams);
      }
    }
  }
  catch (e){
    console.log(e);
  }

  let items = await exams.get(undefined, {withProblems: true});

  if(joinedExams !== null){
    const itemsTemp = [];

    for(let i = 0; i < items.length; i += 1){
      let flag = false;
      for(let j = 0; j < joinedExams.length; j += 1){
        if(items[i].id === joinedExams[j].id){
          flag = true;
          break;
        }
      }

      if(flag !== true){
        itemsTemp.push(items[i]);
      }
    }
    items = itemsTemp;
  }

  return {
    props: {
      user,
      examinations: items
    },
  };
}
