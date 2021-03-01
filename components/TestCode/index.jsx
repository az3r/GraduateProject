import React, { useState } from 'react';
import { Box, Button, makeStyles, Container, Paper } from '@material-ui/core';

import Router from 'next/router';
import SplitPane from 'react-split-pane';
import ClipLoader from 'react-spinners/ClipLoader';

import { codes } from '@libs/client';
import Problem from '@components/TestCode/Problem';
import Console from './Console';
import CodeEditor from '../CodeEditor';

const useStyles = makeStyles(() => ({
  consoleButton: {
    color: 'black',
    backgroundColor: 'white',
    float: 'left',
    marginLeft: 10,
  },
  submitButton: {
    float: 'right',
    marginRight: 10,
  },
  runCodeButton: {
    color: 'black',
    backgroundColor: 'white',
    float: 'right',
    marginRight: 5,
  },
  programmingLanguage: {
    height: 34,
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    borderColor: 'gray',
  },
  compileBox: {
    marginTop: 10,
    height: 50,
    position: 'relative',
  },
  consoleBox: {
    height: 200,
    position: 'absolute',
    top: -200,
    zIndex: 4,
  },
}));

export default function Test({ problem, nextProblem }) {
  const classes = useStyles();

  const [title] = useState(problem.title);
  const [content] = useState(problem.content);
  const [language] = useState(problem.language);
  const [cases] = useState(problem.cases);
  const [difficulty] = useState(problem.difficulty);
  const [score] = useState(problem.score);
  const [code, setCode] = useState(problem.code);
  const [testCodeResult, setTestCodeResult] = useState('');
  const [openConsole, setOpenConsole] = useState('hidden');

  const [loading, setLoading] = useState(false);

  const handleOpenConsoleChange = () => {
    if (openConsole === 'visible') {
      setOpenConsole('hidden');
    } else {
      setOpenConsole('visible');
    }
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOpenConsole('visible');

    // const response = await fetch('/api/test-exam', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     userId: 1,
    //     code,
    //     language,
    //     cases,
    //   }),
    // });

    const response = await codes.test({problemId: problem.id, problemName: problem.title, lang: problem.language, code: problem.code, testcases: problem.cases, save: false});

    const data = await response.json();

    if (response.status === 200) {
      if (data.failed === 0) {
        setTestCodeResult('Correct!');
      } else {
        setTestCodeResult(
          `Incorrect! \nTest Cases: \n${JSON.stringify(cases)}`
        );
      }
    } else {
      // setTestCodeResult('stdout: ${data.stdout}\n' + 'stderr: ${data.stderr}');
      setTestCodeResult('error');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (nextProblem) {
      nextProblem();
    } else {
      setLoading(true);
      // console.log(problem);
      // console.log(code);
      // const response = await fetch('/api/excute-test', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId: 1,
      //     examId: problemId,
      //     code,
      //   }),
      // });

      const response = await codes.test({problemId: problem.id, problemName: problem.title, lang: problem.language, code: problem.code, testcases: problem.cases, save: true});

      // const data = await response.json();

      if (response.status === 200) {
        Router.push('/');
      } else {
        // console.log('Error');
        // alert('ERROR');
      }
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <Container disableGutters maxWidth={false} fixed>
      <SplitPane
        split="vertical"
        minSize={350}
        defaultSize={window.outerWidth / 2}
      >
        <div>
          <Problem
            title={title}
            content={content}
            difficulty={difficulty}
            score={score}
          />
        </div>
        <div>
          <Paper square>
            <Box
              p="10px"
              className={classes.programmingLanguage}
              borderBottom={1}
            >
              <Box
                component="span"
                display="inline"
                p="4px"
                borderRadius={5}
                border={1}
                bgcolor="#fafafa"
              >
                {language}
              </Box>
            </Box>
            <Box boxShadow={1}>
              <CodeEditor
                language={language}
                code={code}
                onCodeChange={handleCodeChange}
              />
            </Box>
            <Box className={classes.compileBox}>
              <Box
                className={classes.consoleBox}
                component="div"
                visibility={openConsole}
              >
                <Console cases={cases} testCodeResult={testCodeResult} />
              </Box>
              <Button
                size="small"
                onClick={handleOpenConsoleChange}
                variant="outlined"
                className={classes.consoleButton}
              >
                Console
              </Button>
              <ClipLoader color="#088247" loading={loading} size={25} />
              <Button
                color="primary"
                variant="contained"
                size="small"
                type="submit"
                onClick={handleSubmit}
                className={classes.submitButton}
              >
                Submit
              </Button>
              <Button
                size="small"
                type="submit"
                variant="outlined"
                onClick={handleRunCode}
                className={classes.runCodeButton}
              >
                Run Code
              </Button>
            </Box>
          </Paper>
        </div>
      </SplitPane>
    </Container>
  );
}
