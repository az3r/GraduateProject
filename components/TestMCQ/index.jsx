import React, {useState} from 'react';

import {
  makeStyles,
  Box,
  Button,
  Container,
  Paper
} from "@material-ui/core";

import SplitPane from 'react-split-pane';
import AnswerMCQ from './AnswerMCQ';
import Problem from './Problem/';


const useStyles = makeStyles( {
  submitButton: {
    color: 'black',
    backgroundColor: 'green',
    float: 'right',
    marginRight: 10,
  },
  programmingLanguage: {
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


export default function Test({problemId, nextProblem}) {
  const classes = useStyles();


  const [title, setTitle] = useState('Title');
  const [content, setContent] = useState('Content');
  const [language, setLanguage] = useState('Language');
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState(100);


  const handleSubmit = async (e) => {
    // e.preventDefault();
    nextProblem();
  }

  return (
    <Container disableGutters={true} maxWidth={false} fixed={true}>
      <SplitPane split="vertical"  minSize={350} defaultSize={window.outerWidth/2}>
        <div>
          <Problem title={title} content={content} difficulty={difficulty} score={score}></Problem>
        </div>
        <div>
          <Paper square>
            <Box p={"10px"} className={classes.programmingLanguage} borderBottom={1}>
              <Box component={"span"} display="inline" p={'4px'}  borderRadius={5} border={1}
                   bgcolor={"#fafafa"}>
                {
                  language
                }
              </Box>
            </Box>
            <Box boxShadow={1}>
              <AnswerMCQ></AnswerMCQ>
            </Box>
            <Box className={classes.submitBox}>
              <Button size={'small'} type="submit" variant="outlined" onClick={handleSubmit}
                      className={classes.submitButton}>Submit</Button>
            </Box>
          </Paper>
        </div>
      </SplitPane>
    </Container>
  );
}
