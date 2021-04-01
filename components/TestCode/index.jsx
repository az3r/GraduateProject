import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, makeStyles, Container, Paper } from '@material-ui/core';

import Router, { useRouter } from 'next/router';
import SplitPane from 'react-split-pane';
import ClipLoader from 'react-spinners/ClipLoader';

import { users, submissions } from '@libs/client';
import Problem from '@components/TestCode/Problem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CodeEditor from '../CodeEditor';
import Console from './Console';


const useStyles = makeStyles(() => ({
  consoleButton: {
    color: 'black',
    backgroundColor: 'white',
    marginRight: 'auto',
    marginLeft: 10,
  },
  submitButton: {
    marginRight: 10,
  },
  runCodeButton: {
    color: 'black',
    backgroundColor: 'white',
    marginRight: 5,
  },
  CODE: {
    height: 34,
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'space-between',
  },
  compileBox: {
    marginTop: 10,
    height: 50,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  consoleBox: {
    height: 200,
    position: 'absolute',
    top: -200,
    zIndex: 4,
  },
}));

export default function Test({ problem, user, problemSubmissionHistory, nextProblem}) {
  const router = useRouter();
  const classes = useStyles();

  const widthRef = useRef(null);
  const [width, setWidth] = useState(500);

  const {id} = problem;
  const {title} = problem;
  const {content} = problem;
  const {language} = problem;
  const {cases} = problem;
  const {difficulty} = problem;
  const {score} = problem;
  const [code, setCode] = useState(problem.code);
  const [testCodeResult, setTestCodeResult] = useState('');
  const [openConsole, setOpenConsole] = useState('hidden');
  const [minutes, setMinutes] = useState(problem.minutes);
  const [seconds, setSeconds] = useState(problem.seconds + 1);

  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitedStatus, setSubmitedStatus] = useState('');

  const handleSubmitClickOpen = (status) => {
    setSubmitOpen(true);
    setSubmitedStatus(status);
  };

  const handleSubmitClose1 = () => {
    setSubmitOpen(false);
  };

  const handleSubmitClose2 = () => {
    setSubmitOpen(false);
    Router.push('/');
  };

  useEffect(() => {
    if(user === null)
    {
      router.replace('/login');
    }
  },[]);

  let timeOut;
  useEffect(() => {
    setCode(problem.code);
    setMinutes(problem.minutes);
    setSeconds(problem.seconds + 1);
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

  useEffect(() => {
    if(widthRef.current){
      setWidth(widthRef.current.offsetWidth);
    }
  }, [widthRef]);

  const handleWidthChange = () => {
    if(widthRef.current){
      setWidth(widthRef.current.offsetWidth);
    }
  }

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

    try {
      const response = await submissions.test({
        lang: problem.language,
        code,
        testcases: problem.cases,
      });

      console.log(response);

      if (response.failed === 0) {
        console.log("Correct!");
        setTestCodeResult('Correct!');
      } else {
        setTestCodeResult(
          `Incorrect! \nTest Cases: \n${JSON.stringify(cases)}`
        );
      }
    } catch (e) {
      setTestCodeResult(`stdout: ${e.stdout}\nstderr: ${e.stder}`);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (nextProblem) {
      setLoading(true);
      clearTimeout(timeOut);
      let result = 0;
      let response = null;
      let status = "";
      try {
        response = await submissions.test({
          lang: problem.language,
          code,
          testcases: problem.cases,
        });

        if (response.status === "passed") {
          result = 1;
          status = "Accepted";
        } else if(response.status === "failed") {
          result = 0;
          status = "Wrong Answer";
        }
      } catch (e) {
        response = e;
        result = 0;
        status = "Compiler Error";
      } finally {
        setLoading(false);
        nextProblem({
            problemId: id,
            problemName: title,
            isMCQ: false,
            status,
            details: {
              code,
              ...response
            }
          },
          result);
      }
    } else {
      setLoading(true);

      try {
        const response = await submissions.test({
          lang: problem.language,
          code,
          testcases: problem.cases,
        });

        if (response.failed === 0) {
          await submissions.createProblemSubmission(
            user.uid,
            {
              problemId: problem.id,
              problemName: problem.title,
              status: "Accepted",
              code,
              data: response,
            });
          await users.updateScoreProblem(user.uid, id, score);
          handleSubmitClickOpen('Accepted');
        } else {
          await submissions.createProblemSubmission(
            user.uid,
            {
              problemId: problem.id,
              problemName: problem.title,
              status: "Wrong Answer",
              code,
              data: response,
            });
          handleSubmitClickOpen('Wrong Answer');
        }
      } catch (e) {
        console.log(e);
        await submissions.createProblemSubmission(
          user.uid,
          {
            problemId: problem.id,
            problemName: problem.title,
            status: "Compiler Error",
            code,
            data: e,
          });
        handleSubmitClickOpen('Compiler Error');
      } finally {
        setLoading(false);
        // handleSubmitClickOpen('');
        // Router.push('/');
      }
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
        style={{height: window.outerHeight - 135}}
        defaultSize={window.outerWidth / 2}
        onChange={handleWidthChange}
      >
        <div>
          <Problem
            title={title}
            content={content}
            difficulty={difficulty}
            score={score}
            problemSubmissionHistory={problemSubmissionHistory}
            language={language}
            id={id}
            user={user}
            nextProblem={nextProblem}
          />
        </div>

        <div>
          <Paper ref={widthRef} style={{maxHeight: window.outerHeight, height: window.outerHeight - 137}} square>
            <Box
              p="10px"
              className={classes.CODE}
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
              {
                nextProblem &&
                <Box>
                  Time out:
                  <Box border={1} style={{borderRadius: 5, borderColor: 'black', color: 'red', padding: 2}} component="span">
                    {(`0${minutes}`).slice(-2)} : {(`0${seconds}`).slice(-2)}
                  </Box>
                </Box>
              }
            </Box>
            <Box boxShadow={1}>
              <CodeEditor
                language={language}
                code={code}
                onCodeChange={handleCodeChange}
                width="100%"
                height={window.outerHeight - 137 - 100}
              />
            </Box>
            <Box className={classes.compileBox}>
              <Box
                className={classes.consoleBox}
                component="div"
                visibility={openConsole}
              >
                <Console cases={cases} testCodeResult={testCodeResult} width={width} />
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
                size="small"
                type="submit"
                variant="outlined"
                onClick={handleRunCode}
                className={classes.runCodeButton}
              >
                Run Code
              </Button>
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
            </Box>
          </Paper>
        </div>
      </SplitPane>

      {/* Commit */}
      <Dialog
        open={submitOpen}
        // onClose={handleSubmitClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              submitedStatus === 'Accepted' &&
                <>
                  <img src="/checkmark.png" alt="Accepted" style={{textAlign: 'center',
                    display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                  <h1 style={{textAlign: 'center', color: 'green'}}>Correct!</h1>
                </>
            }
            {
              submitedStatus === 'Wrong Answer' &&
              <>
                <img src="/warning.png" alt="Wrong Answer" style={{textAlign: 'center',
                  display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                <h1 style={{textAlign: 'center', color: 'orange'}}>Wrong Answer!</h1>
              </>
            }
            {
              submitedStatus === 'Compiler Error' &&
              <>
                <img src="/cancel.png" alt="Compiler Error" style={{textAlign: 'center',
                  display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                <h1 style={{textAlign: 'center', color: 'red'}}>Compiler Error!</h1>
              </>
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitClose1} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitClose2} color="primary" variant="outlined" autoFocus>
            Home
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
