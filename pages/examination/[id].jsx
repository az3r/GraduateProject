import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormHelperText
} from '@material-ui/core';

// import { route } from 'next/dist/next-server/server/router';
// import HTMLReactParser from 'html-react-parser';
// import { calculateTotalExamTime } from '@libs/client/business';
// import AppLayout from '../../components/Layout';
import { parseCookies } from '@client/cookies';
import { exams, developers } from '@libs/client';
import { useRouter  } from 'next/router';
import {formatDuration} from '@client/business';
import dateFormat from 'dateformat';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";

const useStyles = makeStyles({
  welcome: {
    marginTop: 100,
  },
  rules: {
    marginTop: 100,
  },
  infoKey: {
    color: 'gray',
  },
  infoValue: {
    color: 'darkgreen',
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },
});

export default function Introduction({examId, examination, isInvited, isParticipated}) {  // user,
  const classes = useStyles();
  const router = useRouter();

  const [windowHeight, setWindowHeight] = useState(0);
  const [value, setValue] = useState(false);

  const handleValueChange = () => {
    setValue(!value);
  }

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const MySwal = withReactContent(Swal);

  const handleBegin = async () => {
    if(value === false) {
      return;
    }

    MySwal.fire({
      // title: <p>Confirm</p>,
      html: "<p>If you click OK button, you cannot take the contest again!</p>",
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: 'Ok'
    }).then( async (result) => {
      if(result.isConfirmed){
        // await developers.joinExam(user.id, examId);
        router.push(`/examination/start/${examId}`);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Examination - Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container >
        <Grid item xs={12} md={5} >
          <Paper style={{paddingLeft: 50, paddingTop: 50, paddingRight: 50, maxHeight: windowHeight, height: windowHeight, overflow: 'auto'}}>
            <Typography variant="h4" style={{fontWeight: 'bolder'}}>Smart Coder</Typography>
            <br />
            <br />
            <Typography variant="h4" style={{fontWeight: 'bold'}}>{examination.title}</Typography>
            <br />
            <br />
            <Grid container>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Competition Duration</Typography>
                <Typography variant="h6" className={classes.infoValue}>{formatDuration(examination.duration)}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>No. of questions</Typography>
                <Typography variant="h6" className={classes.infoValue}>{`${examination.problems.length} questions`}</Typography>
              </Grid>
              <Grid item />
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Starts at</Typography>
                <Typography variant="h6" className={classes.infoValue}>
                  {dateFormat(
                    new Date(examination.startAt),
                    'dd/mm/yyyy "-" HH:MM TT'
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Ends at</Typography>
                <Typography variant="h6" className={classes.infoValue}>
                  {dateFormat(
                    new Date(examination.endAt),
                    'dd/mm/yyyy "-" HH:MM TT'
                  )}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
             <Box>
              <Typography variant="h6" style={{color: 'darkgray'}}>Sponsored By</Typography>
               <br />
               <Box style={{textAlign: 'center'}}>
                 <img src="/coding.png" alt="coding icon" />
               </Box>
             </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" square  style={{backgroundColor: 'lightgray', paddingLeft: 80, paddingTop: 80, paddingRight: 80, maxHeight: windowHeight, height: windowHeight, overflow: 'auto'}}>
            <Box className={classes.welcome}>
              <Typography variant="h5" style={{fontWeight: 'bolder'}}>Welcome!</Typography>
              <br />
              <Typography variant="subtitle1">
                Welcome to HackerRank Black History Month Coding Challenge, a coding contest where your winnings help support a cause in need. Compete against top coders from around the world to give $500 to a U.S. charity that increases educational opportunities for underrepresented and under-resourced groups.
              </Typography>
            </Box>
            <br />
            <br />

            <Box>
              {
                (isParticipated === false && examination.startAt <= Date.now() && examination.endAt >= Date.now()) &&
                  <>
                    <Box style={{color: 'gray'}}>
                      <FormControl required error component="fieldset">
                        <FormGroup aria-label="position" row>
                          <FormControlLabel
                            value="end"
                            control={<Checkbox onChange={() => handleValueChange()} checked={value} color="primary" />}
                            label="I will not consult/copy code from any source including a website, book, or friend/colleague to complete these tests, though may reference language documentation or use an IDE that has code completion features."
                            labelPlacement="end"
                          />
                        </FormGroup>
                        <FormHelperText>Please accept the declaration statement to start the test.</FormHelperText>
                      </FormControl>
                    </Box>
                    <br />
                    {/* href or onclick */}
                    <Button onClick={() => handleBegin()} style={{marginLeft: 10}} variant="contained" color="primary">Let's Begin!</Button>
                    {
                      isInvited === false &&
                      <Button style={{marginLeft: 10}} variant="contained" color="default">Leader Board</Button>
                    }
                  </>
              }
              {
                (isParticipated === true && examination.startAt <= Date.now() && examination.endAt >= Date.now()) &&
                <>
                  <Typography variant="h5" style={{color: 'red', fontWeight: 'bolder'}}>You have already joined this contest!</Typography>
                  <br />
                  <Button style={{marginLeft: 10}} variant="contained" color="primary" disabled>Let's Begin!</Button>
                  {
                    isInvited === false &&
                    <Button style={{marginLeft: 10}} variant="contained" color="default">Leader Board</Button>
                  }
                </>
              }
              {
                examination.startAt > Date.now() &&
                <>
                  <Typography variant="h5" style={{color: 'red', fontWeight: 'bolder'}}>The contest has not yet started!</Typography>
                  <br />
                  <Button style={{marginLeft: 10}} variant="contained" color="primary" disabled>Let's Begin!</Button>
                  {
                    isInvited === false &&
                    <Button style={{marginLeft: 10}} variant="contained" color="default">Leader Board</Button>
                  }
                </>
              }
              {
                examination.endAt < Date.now() &&
                <>
                  <Typography variant="h5" style={{color: 'red', fontWeight: 'bolder'}}>The contest has already ended!</Typography>
                  <br />
                  <Button style={{marginLeft: 10}} variant="contained" color="primary" disabled>Let's Begin!</Button>
                  {
                    isInvited === false &&
                    <Button style={{marginLeft: 10}} variant="contained" color="default">Leader Board</Button>
                  }
                </>
              }
            </Box>

            <Box className={classes.rules}>
              <Typography variant="h5" style={{fontWeight: 'bolder'}}>The Rules</Typography>
              <br />
              <Typography variant="subtitle1">
                1. This contest is for individuals; teams are not allowed.
              </Typography>
              <br />
              <Typography variant="subtitle1">
                2. Any competitor found cheating will be disqualified and banned from future coding contests.
              </Typography>
              <br />
              <Typography variant="subtitle1">
                3. By participating and selecting "I'm interested in new job opportunities", you are indicating that you are willing to be considered for employment by companies using HackerRank for recruitment purposes.
              </Typography>
              <br />

              <Typography variant="h6">Scoring:</Typography>
              <Typography variant="subtitle1">
                Participants are ranked by score. Your score is determined by the number of test cases your code submission successfully passes. If two participants have the same score, the tie is broken by the contestant with the lowest amount of time taken.
              </Typography>
              <br />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;
  let isInvited = false;
  let isParticipated = false;

  const examination = await exams.get({examId: params.id });

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
        user = await developers.get(user.uid);

        if(examination.password !== ''){

          const invitedDevelopers = await exams.getInvitedDevelopers(params.id);

          for(let i = 0; i < invitedDevelopers.length; i+=1){
            if(invitedDevelopers[i].id === user.id){
              isInvited = true;
              break;
            }
          }

          if(isInvited === false){
            return {
              redirect: {
                permanent: false,
                destination: "/examination/reject/uninvited_forbidden"
              }
            }
          }
        }
      }
      else{
        return {
          redirect: {
            permanent: false,
            destination: "/login"
          }
        }
      }
    }
  }
  catch (e){
    console.log(e);
  }

  const joinedExams = await developers.getJoinedExams(user);
  for(let i = 0; i < joinedExams.length; i+=1){
    if(joinedExams[i].id === params.id){
      isParticipated = true;
    }
  }

  console.log(user);

  return {
    props: {
      // user,
      examId: params.id,
      examination,
      isInvited,
      isParticipated
    },
  };
}
