import React from 'react';

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
  },
  submitBox: {
    marginTop: 10,
    height: 50,
    position: 'relative',
  },
});


export default function Test({problem, nextProblem}) {
  const classes = useStyles();

  const {title} = problem;
  const {question} = problem;
  const {difficulty} = problem;
  const {score} = problem;


  const handleSubmit = () => {
    if (nextProblem) {
      nextProblem();
    }
  }

  return (
    <Container disableGutters maxWidth={false} fixed>
      <SplitPane split="vertical"  minSize={350} defaultSize={window.outerWidth/2}>
        <div>
          <Problem title={title} question={question} difficulty={difficulty} score={score} />
        </div>
        <div>
          <Paper square>
            <Box p="10px" className={classes.MCQ} borderBottom={1}>
              <Box component="span" display="inline" p="4px"  borderRadius={5} border={1}
                   bgcolor="#fafafa">
                Multiple Choice Question
              </Box>
            </Box>
            <Box boxShadow={1}>
              <AnswerMCQ />
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
