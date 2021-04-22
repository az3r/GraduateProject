import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel, Typography, Container, Hidden, Button,
} from '@material-ui/core';

import HTMLReactParser from 'html-react-parser';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { users } from '@libs/client';


const styles = makeStyles({
  root: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  subNavBar: {
    backgroundColor: 'white',
    height: 100,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default function TestProblemMCQ({examId, index, problem, onIsSolvedProblemsChange, onNextQuestion}) {  // , user
  const classes = styles();
  const [author, setAuthor] = useState({uid: "", name: ""});
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    // get from LocalStorage
    const resultJson = localStorage.getItem(`${examId}${index}`);

    if(resultJson !== null){
      const resultObject = JSON.parse(resultJson);
      setAnswer(resultObject.details.selectedAnswer);
    }
  }, []);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);

    // set IsSolvedProblems[index] = true;
    onIsSolvedProblemsChange(index);


    // save to LocalStorage
    const result = {
      problemId: problem.id,
      problemName: problem.name,
      isMCQ: true,
      status: problem.correct === event.target.value,
      details: {
        selectedAnswer: event.target.value,
        correctAnswer: problem.correct
    }};

    localStorage.setItem(`${examId}${index}`, JSON.stringify(result));
  }

  useEffect(async () => {
    const problemAuthor = await users.get(problem.owner);

    if(problemAuthor !== undefined){
      setAuthor(problemAuthor);
    }
  }, []);

  const handleContinue = () => {
    onNextQuestion();
  }

  return (
    <>
      <Container maxWidth disableGutters>
        <Grid container>
          <Hidden smDown>
            <Grid item xs={12} container className={classes.subNavBar} direction="row" justify="space-between" alignItems="center">
              <Box style={{marginLeft: 80}}>
                <Typography variant="h4" style={{fontWeight: "bolder"}}>Multiple Choice Question</Typography>
                {/* <hr /> */}
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} md={9}>
            <Box style={{marginLeft: 80}} borderRight={1} borderColor="green">
              <Typography variant="subtitle1">{HTMLReactParser(problem.question)}</Typography>
              <Box style={{width: '60%'}}>
                <Typography variant="subtitle1" style={{fontWeight: "bolder"}}>Choose your answer: </Typography>
                <RadioGroup style={{marginLeft: 20}}  aria-label="gender" name="gender1" value={answer} onChange={handleAnswerChange}>
                  {
                    problem.a !== '' &&
                      <Box border={1} pl={1} mt={1} borderRadius={10} borderColor="green">
                        <FormControlLabel value="A" control={<Radio />} label={HTMLReactParser(problem.a)} />
                      </Box>
                  }
                  {
                    problem.b !== '' &&
                    <Box border={1} pl={1} mt={1} borderRadius={10} borderColor="green">
                      <FormControlLabel value="B" control={<Radio />} label={HTMLReactParser(problem.b)} />
                    </Box>
                  }
                  {
                    problem.c !== '' &&
                    <Box border={1} pl={1} mt={1} borderRadius={10} borderColor="green">
                      <FormControlLabel value="C" control={<Radio />} label={HTMLReactParser(problem.c)} />
                    </Box>
                  }
                  {
                    problem.d !== '' &&
                    <Box border={1} pl={1} mt={1} borderRadius={10} borderColor="green">
                      <FormControlLabel value="D" control={<Radio />} label={HTMLReactParser(problem.d)} />
                    </Box>
                  }
                </RadioGroup>
              </Box>
              <br />
              <Button onClick={() => handleContinue()} variant="contained" color="primary">Continue</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box className={classes.root}>
              <Box className={classes.info}>
                <Typography style={{color: 'green', fontWeight: 'bolder'}}>Author</Typography>
                <Link href={`/profile/${author.uid}`} variant="body2">{author.name}</Link>
              </Box>
              <hr />
              <Box className={classes.info}>
                <Typography style={{color: 'green', fontWeight: 'bolder'}}>Difficulty</Typography>
                {
                  problem.difficulty === 0 &&
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Easy</Typography>
                }
                {
                  problem.difficulty === 1 &&
                  <Typography style={{color: 'orange', fontWeight: 'bolder'}}>Medium</Typography>
                }
                {
                  problem.difficulty === 2 &&
                  <Typography style={{color: 'red', fontWeight: 'bolder'}}>Hard</Typography>
                }
              </Box>
              <hr />
              <Box className={classes.info}>
                <Typography style={{color: 'green', fontWeight: 'bolder'}}>Max Score</Typography>
                <Typography>{problem.score}</Typography>
              </Box>
              <hr />
              <Box className={classes.info}>
                <Typography style={{color: 'green', fontWeight: 'bolder'}}>Programing Language</Typography>
                <Typography>#</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
}
