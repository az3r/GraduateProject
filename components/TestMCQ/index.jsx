import React, { useEffect, useState } from 'react';

import {
  makeStyles,
  Box,
  Button,
  Container,
  Paper
} from "@material-ui/core";

import SplitPane from 'react-split-pane';
import AnswerMCQ from './AnswerMCQ';
import Problem from "./Problem";


const useStyles = makeStyles( {
  submitButton: {
    color: 'black',
    backgroundColor: 'green',
    float: 'right',
    marginRight: 10,
  },
  MCQ: {
    height: 34,
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'space-between',
  },
  submitBox: {
    marginTop: 10,
    height: 50,
    position: 'relative',
  },
});


export default function Test({problem, nextProblem}) {
  const classes = useStyles();

  const {question} = problem;
  const {difficulty} = problem;
  const {score} = problem;
  const {a, b, c, d} = problem;
  const [answer, setAnswer] = useState('');
  const [minutes, setMinutes] = useState(problem.minutes);
  const [seconds, setSeconds] = useState(problem.seconds);

  let timeOut;
  useEffect(() => {
    setMinutes(problem.minutes);
    setSeconds(problem.seconds);
  }, [problem]);

  useEffect(() => {
    timeOut = setTimeout(() => {
      if(seconds === 0){
        if(minutes === 0){
          if (nextProblem) {
            handleSubmit();
          }
        }
        else{
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
      else{
        setSeconds(seconds - 1);
      }
    }, 1000);
  }, [seconds]);


  const handleSubmit = () => {
    if (nextProblem) {
      clearTimeout(timeOut);
      nextProblem();
    }
  }

  return (
    <Container disableGutters maxWidth={false} fixed>
      <SplitPane split="vertical"  minSize={350} defaultSize={window.outerWidth/2}>
        <div>
          <Problem question={question} difficulty={difficulty} score={score} />
        </div>
        <div>
          <Paper square>
            <Box p="10px" className={classes.MCQ} borderBottom={1}>
              <Box component="span" display="inline" p="4px"  borderRadius={5} border={1}
                   bgcolor="#fafafa">
                Multiple Choice Question
              </Box>
              <Box>
                Time out:
                <Box border={1} style={{borderRadius: 5, borderColor: 'black', color: 'red', padding: 2}} component="span">
                  {(`0${minutes}`).slice(-2)} : {(`0${seconds}`).slice(-2)}
                </Box>
              </Box>
            </Box>
            <Box boxShadow={1}>
              <AnswerMCQ answer={answer} onAnswerChange={setAnswer} a={a} b={b} c={c} d={d}/>
            </Box>
            <Box className={classes.submitBox}>
              <Button size="small" type="submit" variant="outlined" onClick={handleSubmit}
                      className={classes.submitButton}>Submit</Button>
            </Box>
          </Paper>
        </div>
      </SplitPane>
    </Container>
  );
}
