import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Grid,
  Typography, Box,
} from '@material-ui/core';

// import { route } from 'next/dist/next-server/server/router';
// import { useRouter  } from 'next/router';
// import HTMLReactParser from 'html-react-parser';
// import { calculateTotalExamTime } from '@libs/client/business';
// import AppLayout from '../../components/Layout';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

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

export default function Introduction() {  // { exam, user }
  const classes = useStyles();
  // const router = useRouter();

  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  // useEffect(async () => {
  //   await users.updateScoreExam(user.uid, exam.id, 0);
  // }, []);

  // const beforeunload = async (event) => {
  //   event.preventDefault();
  //   event.returnValue = "Are you sure you want to leave this page?";
  //   return event.returnValue;
  // }
  //
  // // const unload = async () => {
  // //   await users.updateScoreExam(user.uid, exam.id, 0);
  // // }
  //
  // useEffect(() => {
  //   window.addEventListener('beforeunload', beforeunload);
  //   // window.addEventListener('unload', unload);
  //   return () => {
  //     window.removeEventListener('beforeunload', beforeunload);
  //     // window.removeEventListener('unload', unload);
  //   }
  // });
  //
  // const start = (examId) => {
  //   // window.onbeforeunload = null;
  //   // window.onunload = null;
  //
  //   router.push(`/examination/start/${examId}`);
  // }

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
            <Typography variant="h4" style={{fontWeight: 'bold'}}>International Women Day Coding Contest 2021</Typography>
            <br />
            <br />
            <Grid container>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Competition Duration</Typography>
                <Typography variant="h6" className={classes.infoValue}>180 minutes</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>No. of questions</Typography>
                <Typography variant="h6" className={classes.infoValue}>4 questions</Typography>
              </Grid>
              <Grid item />
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Starts at</Typography>
                <Typography variant="h6" className={classes.infoValue}>3/8/2021 - 12:00AM</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography variant="inherit" className={classes.infoKey}>Ends at</Typography>
                <Typography variant="h6" className={classes.infoValue}>3/10/2021 - 12:00AM</Typography>
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
              <Box style={{color: 'gray'}}>
                <FormControl required error component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox color="primary" />}
                      label="I will not consult/copy code from any source including a website, book, or friend/colleague to complete these tests, though may reference language documentation or use an IDE that has code completion features."
                      labelPlacement="end"
                    />
                  </FormGroup>
                  <FormHelperText>Please accept the declaration statement to start the test.</FormHelperText>
                </FormControl>
              </Box>
              <br />
              {/* href or onclick */}
              <Button variant="contained" color="primary">Let's Begin!</Button>
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

// export async function getServerSideProps({ params, req }) {
//   const cookies = parseCookies(req);
//   let user = null;
//
//   try {
//     if (Object.keys(cookies).length !== 0) {
//       if (cookies.user) {
//         user = JSON.parse(cookies.user);
//       }
//     }
//   }
//   catch (e){
//     console.log(e);
//   }
//
//   const item = await exams.get(params.id, { withProblems: true });
//   return {
//     props: {
//     },
//   };
// }
