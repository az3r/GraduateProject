import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { exams } from '@libs/client';
// import { useRouter } from 'next/router';
import { parseCookies } from '@libs/client/cookies';
import {
  makeStyles,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  AppBar,
  Box,
  Typography,
  Tab,
  Tabs
} from '@material-ui/core';
// import PropTypes from 'prop-types';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import BackupIcon from '@material-ui/icons/Backup';
import TimerIcon from '@material-ui/icons/Timer';
// import dateFormat from 'dateformat';
// import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';


const TestProblemCoding = dynamic(() => import('../../../components/Examinations/TestProblemCoding'), {
  ssr: false,
});

const TestProblemMCQ = dynamic(() => import('../../../components/Examinations/TestProblemMCQ'), {
  ssr: false,
});


function TabPanel(props) {
  const { children, value, index } = props; // , ...other

  return (
    // <div
    //   role="tabpanel"
    //   hidden={value !== index}
    //   id={`vertical-tabpanel-${index}`}
    //   aria-labelledby={`vertical-tab-${index}`}
    //   {...other}
    // >
    <>
      {value === index && (
        // <Paper style={{paddingLeft: 20, paddingRight: 20, maxHeight: 800, height: 800,  minWidth: 800, maxWidth: 800, overflow: 'auto'}}>
        //   <Typography>{children}</Typography>
        // </Paper>
        children
      )}
    </>

    // </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    backgroundColor: 'lightgray',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    minWidth: 80,
    width: 80,
    minHeight: 60,
    height: 60,
  },
  title: {
    flexGrow: 1,
  },
  minutes: {
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'green',
    cursor: 'pointer',
  },
  submit: {
    display: 'block',
    float: 'right',
    marginTop: 20,
    marginRight: 80,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.5em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
}));


export default function Start({ examId, problems, user }) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isSolvedProblems, setIsSolvedProblems] = useState(new Array(problems.length).fill(false));
  const [timeOut, setTimeOut] = useState(1200);

  const MySwal = withReactContent(Swal);

  const handleSubmit = async () => {
    MySwal.fire({
      title: 'Please Wait !',
      html: 'Submitting...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        MySwal.showLoading();
      }
    });

    await setTimeout(() => { MySwal.close()}, 3000);

    MySwal.fire({
      title: 'Finished!',
      icon: 'success',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        // router.push('/login');
      }
    });

    // MySwal.fire({
    //   title: <p>You have not logged in yet, please log into your account!</p>,
    //   icon: 'info',
    //   inputOptions: inputOptions,
    //   showCancelButton: true,
    //   confirmButtonText: 'Login'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     router.push('/login');
    //   }
    // });
  }
  useEffect(() => {
    const isSolvedProblemsJson = localStorage.getItem(`${examId}isSolvedProblems`);
    if(isSolvedProblemsJson !== null){
      const isSolvedProblemsObject = JSON.parse(isSolvedProblemsJson);
      setIsSolvedProblems(isSolvedProblemsObject);
    }
  }, []);

  const handleIsSolvedProblemsChange = (index) => {
    const isSolvedProblemsDump = isSolvedProblems;
    isSolvedProblemsDump[index] = true;
    setIsSolvedProblems(isSolvedProblemsDump);

    // Save isSolvedProblems to LocalStorage
    localStorage.setItem(`${examId}isSolvedProblems`, JSON.stringify(isSolvedProblemsDump));
  }


  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);

    setTimeout(() => {
      console.log(timeOut);
      setTimeOut(timeOut - 1);

    }, 1000);
  }, [timeOut]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleQuestionChange = (newValue) => {
    setValue(newValue);
  }

  const handleNextQuestion = () => {
    if(value === problems.length){
      setValue(0);
    }
    else{
      setValue(value + 1);
    }
  }
  // const router = useRouter();
  // const [index, setIndex] = useState(0);
  // const [problem, setProblem] = useState(problems[0]);
  // const [results, setResults] = useState([]);
  // const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  // const [commentOpen, setCommentOpen] = useState(false);
  // const [commentContent, setCommentContent] = useState('');
  // const [totalScore, setTotalScore] = useState(0);

  // useEffect(async () => {
  //   if (user === null) {
  //     router.replace('/login');
  //   }
  //   else{
  //       await users.updateScoreExam(user.uid, id, 0);
  //   }
  // }, []);
  //
  //
  // const nextProblem = async (result, correct) => {
  //   const resultsTemp = results;
  //   let numberOfCorrectTemp = numberOfCorrect;
  //   let totalScoreTemp = totalScore;
  //
  //   if (result) {
  //     resultsTemp.push(result);
  //     numberOfCorrectTemp += parseInt(correct, 10);
  //
  //     setResults(resultsTemp);
  //     // setResults(prevState => [...prevState, result]);
  //     setNumberOfCorrect(numberOfCorrect + parseInt(correct, 10));
  //
  //     if(correct === 1){
  //       totalScoreTemp += problem.score;
  //       setTotalScore(totalScoreTemp);
  //     }
  //   }
  //
  //   const indexNext = index + 1;
  //   setIndex(indexNext);
  //
  //   if (indexNext < problems.length) {
  //     setProblem(problems[indexNext]);
  //   } else {
  //     await submissions.createExamSubmission(user.uid, {
  //       examId: id,
  //       total: problems.length,
  //       correct: numberOfCorrectTemp,
  //       results: resultsTemp,
  //     });
  //     await users.updateScoreExam(user.uid, id, totalScoreTemp);
  //     handleCommentClickOpen();
  //   }
  // };
  //
  // const beforeunload = async (event) => {
  //   event.preventDefault();
  //   event.returnValue = "Are you sure you want to leave this page?";
  //   return event.returnValue;
  // }


  // const unload = async () => {
  //   await users.updateScoreExam(user.uid, id, 0);
  // }

  // useEffect(() => {
  //   window.addEventListener('beforeunload', beforeunload);
  //   // window.addEventListener('unload', unload);
  //   return () => {
  //     window.removeEventListener('beforeunload', beforeunload);
  //     // window.removeEventListener('unload', unload);
  //   }
  // });


  // const handleCommentContentChange = (e) => {
  //   e.preventDefault();
  //   setCommentContent(e.target.value);
  // };
  //
  // const handleCommentClickOpen = () => {
  //   setCommentOpen(true);
  // };
  //
  // const handleCommentClose = async () => {
  //   const usr = await users.get();
  //
  //   if (usr !== null) {
  //     await comments.createExamComment(id, {
  //       userId: usr.id,
  //       username: usr.name,
  //       avatar: usr.avatar,
  //       content: 'No comment!',
  //     });
  //     setCommentOpen(false);
  //     router.push('/examination/end');
  //   }
  // };
  //
  // const handleComment = async () => {
  //   const usr = await users.get();
  //
  //   if (usr !== null) {
  //     await comments.createExamComment(id, {
  //       userId: usr.id,
  //       username: usr.name,
  //       avatar: usr.avatar,
  //       content: commentContent,
  //     });
  //     setCommentOpen(false);
  //     router.push('/examination/end');
  //   }
  // };

  return (
    <>
      <Head>
        <title>Examination - Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static" style={{height: 60}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Examination Name
          </Typography>

          <Box className={classes.minutes}>
            <TimerIcon />
            <Typography variant="h6">
              {Math.ceil(timeOut/60)} mins left
            </Typography>
          </Box>

          <Button onClick={() => handleSubmit()} color="inherit" size="large" startIcon={<BackupIcon />}>Submit</Button>
        </Toolbar>
      </AppBar>

      <div className={classes.root} style={{height: windowHeight - 60}}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
          textColor="primary"
          indicatorColor="primary"
        >
          {
            value === 0 &&
            <Tab style={{backgroundColor: 'white', fontWeight: 'bolder'}} label="All" className={classes.tab} {...a11yProps(0)} />
          }
          {
            value !== 0 &&
            <Tab label="All" className={classes.tab} {...a11yProps(0)} />
          }
          {
            problems.map((problem, index) => {
              if((index + 1) === value){
                return (
                  <Tab style={{backgroundColor: 'white', fontWeight: 'bolder'}} label={index + 1} className={classes.tab} {...a11yProps(index + 1)} />
                )
              }

                return (
                  <Tab label={index + 1} className={classes.tab} {...a11yProps(index + 1)} />
                )

            })
          }
        </Tabs>
        <TabPanel value={value} index={0}>
          <Paper style={{paddingLeft: 50, paddingTop: 20, paddingBottom: 20, paddingRight: 50, maxHeight: windowHeight - 60, height: windowHeight - 60,  minWidth: windowWidth - 80, width: windowWidth - 80, overflow: 'auto'}}>
            <Table size="medium" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" style={{color: 'gray'}}>
                      #
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" style={{color: 'gray'}}>
                      Questions
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" style={{color: 'gray'}}>
                      Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" style={{color: 'gray'}}>
                      Action
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {
                problems &&
                <TableBody>
                  {
                    problems.map((problem, index) => (
                      <TableRow
                        key={problem.id}
                        hover
                        style={
                          index % 2
                            ? { background: 'rgb(250, 250, 250)' }
                            : { background: 'white' }
                        }
                      >
                        {
                          problem.isMCQ === false &&
                            <>
                              <TableCell>
                                  {index + 1}
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">
                                  {problem.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                Coding
                              </TableCell>
                            </>
                        }
                        {
                          problem.isMCQ === true &&
                          <>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">
                                {HTMLReactParser(problem.question)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              Multiple Choice
                            </TableCell>
                          </>
                        }
                        <TableCell>
                          {
                            isSolvedProblems[index] === false &&
                            <Button onClick={() => handleQuestionChange(index + 1)} size="large" variant="contained" color="primary">Solve</Button>
                          }
                          {
                            isSolvedProblems[index] === true &&
                            <Button onClick={() => handleQuestionChange(index + 1)} size="large" variant="outlined" color="primary">Modify</Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              }
            </Table>
            <Button onClick={() => handleSubmit()} size="large" variant="outlined" color="primary" className={classes.submit}>Submit</Button>
          </Paper>
        </TabPanel>
        {
          problems.map((problem, index) => {
            if(problem.isMCQ === false){
              return (
                <TabPanel value={value} index={index + 1}>
                  <Paper style={{paddingLeft: 50, paddingTop: 20, paddingBottom: 20, paddingRight: 50, maxHeight: windowHeight - 60, height: windowHeight - 60,  minWidth: windowWidth - 80, width: windowWidth - 80, overflow: 'auto'}}>
                    <TestProblemCoding examId={examId} index={index} problem={problem} user={user} onIsSolvedProblemsChange={handleIsSolvedProblemsChange} onNextQuestion={handleNextQuestion} />
                  </Paper>
                </TabPanel>
              )
            }

              return (
                <TabPanel value={value} index={index + 1}>
                  <Paper style={{paddingLeft: 50, paddingTop: 20, paddingBottom: 20, paddingRight: 50, maxHeight: windowHeight - 60, height: windowHeight - 60,  minWidth: windowWidth - 80, width: windowWidth - 80, overflow: 'auto'}}>
                    <TestProblemMCQ examId={examId} index={index} problem={problem} user={user} onIsSolvedProblemsChange={handleIsSolvedProblemsChange} onNextQuestion={handleNextQuestion} />
                  </Paper>
                </TabPanel>
              )

          })
        }
      </div>

      {/* Comment */}
      {/* <Dialog */}
      {/*  open={commentOpen} */}
      {/*  onClose={handleCommentClose} */}
      {/*  aria-labelledby="form-dialog-title" */}
      {/*  maxWidth="sm" */}
      {/*  fullWidth */}
      {/* > */}
      {/*  <DialogTitle id="form-dialog-title" style={{ color: 'green' }}> */}
      {/*    <EditIcon fontSize="medium" /> */}
      {/*    Your comments! */}
      {/*  </DialogTitle> */}
      {/*  <DialogContent> */}
      {/*    <DialogContentText> */}
      {/*      Please type your comments here...! */}
      {/*    </DialogContentText> */}
      {/*    <TextareaAutosize */}
      {/*      rowsMax={10} */}
      {/*      rowsMin={10} */}
      {/*      style={{ width: '100%' }} */}
      {/*      value={commentContent} */}
      {/*      onChange={handleCommentContentChange} */}
      {/*      placeholder="Type your comments here!" */}
      {/*    /> */}
      {/*  </DialogContent> */}
      {/*  <DialogActions> */}
      {/*    <Button */}
      {/*      onClick={handleCommentClose} */}
      {/*      color="secondary" */}
      {/*      variant="outlined" */}
      {/*    > */}
      {/*      Cancel */}
      {/*    </Button> */}
      {/*    <Button onClick={handleComment} color="primary" variant="outlined"> */}
      {/*      Post */}
      {/*    </Button> */}
      {/*  </DialogActions> */}
      {/* </Dialog> */}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;
  let items = null;

  try {
    items = await exams.getProblems(params.id);
    console.log(items);

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
      }
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      examId: params.id,
      problems: items,
      user,
    },
  };
}
