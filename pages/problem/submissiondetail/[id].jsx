import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { developers } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {
  Container,
  Hidden,
  InputBase,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  withStyles,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import dateFormat from 'dateformat';
import AppLayout from '../../../components/Layout';

const CodeEditor = dynamic(() => import('../../../components/CodeEditor'), {
  ssr: false,
});

function TabPanel(props) {
  const { children, value, index } = props;

  return <div>{value === index && <Box>{children}</Box>}</div>;
}

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  link: {
    color: 'green',
    cursor: 'pointer',
  },
}))(InputBase);

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  root2: {
    flexGrow: 1,
    backgroundColor: 'white',
    display: 'flex',
    height: 350,
  },
  subNavBar: {
    backgroundColor: 'white',
    height: 100,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tabs: {
    backgroundColor: 'lightgray',
    // borderRight: `1px solid black`,
  },
  controlBoard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.1em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
  },
}));

export default function SubmissionDetails({ problemSubmissionDetails }) {
  // , user
  const classes = useStyles();

  const [code, setCode] = useState(problemSubmissionDetails.code);
  const [theme, setTheme] = useState('xcode');
  const [size, setSize] = useState(20);
  const [value, setValue] = useState(0);

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <>
      <Head>
        <title>Submission Detail | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container maxWidth="xl" disableGutters>
          <Grid container>
            <Hidden smDown>
              <Grid
                item
                xs={12}
                container
                className={classes.subNavBar}
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Box style={{ marginLeft: 80 }}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">
                      Home
                    </Link>
                    <Link
                      color="inherit"
                      href={`/problem/${problemSubmissionDetails.problemId}`}
                    >
                      Problem
                    </Link>
                    <Link color="inherit" href="/submissions">
                      Submission Details
                    </Link>
                    <Typography color="textPrimary">
                      {problemSubmissionDetails.problemName}
                    </Typography>
                  </Breadcrumbs>
                  <Typography variant="h4" style={{ fontWeight: 'bolder' }}>
                    {problemSubmissionDetails.problemName}
                  </Typography>
                </Box>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
        <br />
        <Container maxWidth="md">
          <Box boxShadow={3} p={3}>
            <Box border={1} p={2}>
              <Typography variant="subtitle1">
                You made this submission on
                {` ${dateFormat(
                  new Date(problemSubmissionDetails.createdOn),
                  'mmmm dd, yyyy "at" HH:MM TT'
                )}`}
              </Typography>
              <Typography variant="h6" style={{ marginRight: 30 }}>
                Language:{' '}
                <span style={{ fontWeight: 'normal', color: 'gray' }}>
                  {problemSubmissionDetails.language}
                </span>
              </Typography>
              <Box style={{ display: 'flex' }}>
                <Typography variant="h6" style={{ marginRight: 30 }}>
                  Score:{' '}
                  <span style={{ fontWeight: 'normal', color: 'gray' }}>
                    {problemSubmissionDetails.score}
                  </span>
                </Typography>
                <Typography variant="h6" style={{ marginRight: 30 }}>
                  Status:
                  {problemSubmissionDetails.status === 'Accepted' && (
                    <span
                      style={{ color: 'green' }}
                    >{` ${problemSubmissionDetails.status}`}</span>
                  )}
                  {problemSubmissionDetails.status === 'Wrong Answer' && (
                    <span
                      style={{ color: 'orange' }}
                    >{` ${problemSubmissionDetails.status}`}</span>
                  )}
                  {(problemSubmissionDetails.status === 'Compilation Error' ||
                    problemSubmissionDetails.status ===
                      'Time Limit Exceeded') && (
                    <span
                      style={{ color: 'red' }}
                    >{` ${problemSubmissionDetails.status}`}</span>
                  )}
                </Typography>
              </Box>

              <Box style={{ display: 'flex' }}>
                {(problemSubmissionDetails.status === 'Accepted' ||
                  problemSubmissionDetails.status === 'Wrong Answer') && (
                  <Typography variant="h6" style={{ marginRight: 30 }}>
                    Runtime:
                    <span style={{ fontWeight: 'normal', color: 'gray' }}>
                      {' '}
                      {problemSubmissionDetails.totalElapsedTime} ms
                    </span>
                  </Typography>
                )}
                {(problemSubmissionDetails.status === 'Compilation Error' ||
                  problemSubmissionDetails.status ===
                    'Time Limit Exceeded') && (
                  <Typography variant="h6" style={{ marginRight: 30 }}>
                    Runtime:
                    <span style={{ fontWeight: 'normal', color: 'gray' }}>
                      {' '}
                      N/A
                    </span>
                  </Typography>
                )}
                <Typography variant="h6" style={{ marginRight: 30 }}>
                  {(problemSubmissionDetails.status === 'Accepted' ||
                    problemSubmissionDetails.status === 'Wrong Answer') && (
                    <>
                      {problemSubmissionDetails.passed} /{' '}
                      {problemSubmissionDetails.total}
                      <span style={{ fontWeight: 'normal', color: 'gray' }}>
                        {' test cases passed.'}
                      </span>
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
            <br />
            <Box className={classes.controlBoard}>
              <Box
                component="span"
                display="inline"
                p="8px"
                borderColor="green"
                bgcolor="#fafafa"
                style={{ fontWeight: 'bolder', width: 250, fontSize: 25 }}
              >
                Submitted Code
              </Box>
              <Box>
                <Select
                  style={{ minWidth: 50, marginRight: 20 }}
                  value={size}
                  onChange={handleSizeChange}
                  input={<BootstrapInput />}
                >
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={18}>18</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={28}>28</MenuItem>
                  <MenuItem value={32}>32</MenuItem>
                  <MenuItem value={40}>40</MenuItem>
                </Select>
                <Select
                  style={{ minWidth: 150 }}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={theme}
                  onChange={handleThemeChange}
                  input={<BootstrapInput />}
                >
                  <MenuItem value="xcode">Xcode</MenuItem>
                  <MenuItem value="monokai">Monokai</MenuItem>
                  <MenuItem value="github">Github</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="kuroir">Kuroir</MenuItem>
                  <MenuItem value="solarized_dark">Solarized Dark</MenuItem>
                  <MenuItem value="textmate">Textmate</MenuItem>
                  <MenuItem value="solarized_light">Solarized Light</MenuItem>
                  <MenuItem value="terminal">Terminal</MenuItem>
                  <MenuItem value="twilight">Twilight</MenuItem>
                </Select>
              </Box>
            </Box>
            <CodeEditor
              language={problemSubmissionDetails.language}
              code={code}
              onCodeChange={handleCodeChange}
              width="100%"
              height={450}
              size={size}
              theme={theme}
            />
          </Box>
        </Container>
        <br />
        <br />
        <Container maxWidth="md">
          <Box boxShadow={3} className={classes.root2}>
            {(problemSubmissionDetails.status === 'Accepted' ||
              problemSubmissionDetails.status === 'Wrong Answer') && (
              <>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  className={classes.tabs}
                  indicatorColor="primary"
                >
                  {problemSubmissionDetails.results.map((result, index) => {
                    if (index === value) {
                      if (result.passed === false) {
                        return (
                          <Tab
                            icon={<CloseIcon />}
                            label={`Sample Test case ${index}`}
                            style={{ backgroundColor: 'white', color: 'red' }}
                          />
                        );
                      }

                      return (
                        <Tab
                          icon={<CheckIcon />}
                          label={`Sample Test case ${index}`}
                          style={{ backgroundColor: 'white', color: 'green' }}
                        />
                      );
                    }

                    if (result.passed === false) {
                      return (
                        <Tab
                          icon={<CloseIcon />}
                          label={`Sample Test case ${index}`}
                          style={{ color: 'red' }}
                        />
                      );
                    }

                    return (
                      <Tab
                        icon={<CheckIcon />}
                        label={`Sample Test case ${index}`}
                        style={{ color: 'green' }}
                      />
                    );
                  })}
                </Tabs>
                {problemSubmissionDetails.results.map((result, index) => (
                  <TabPanel value={value} index={index}>
                    <Box
                      style={{
                        paddingLeft: 50,
                        paddingRight: 50,
                        paddingTop: 50,
                        overflow: 'auto',
                        maxHeight: 350,
                        maxWidth: 800,
                      }}
                    >
                      {result.passed === false && (
                        <>
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Compiler Message
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            Wrong Answer
                          </Typography>
                          <br />
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Input (stdin)
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.input}
                          </Typography>
                          <br />
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Your Output (stdout)
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.actual}
                          </Typography>
                          <br />
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Expected Output
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.expected}
                          </Typography>
                          <br />
                        </>
                      )}
                      {result.passed === true && (
                        <>
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Input (stdin)
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.input}
                          </Typography>
                          <br />
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Your Output (stdout)
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.expected}
                          </Typography>
                          <br />
                          <Typography variant="h6" style={{ color: 'gray' }}>
                            Expected Output
                          </Typography>
                          <Typography
                            style={{ marginLeft: 20, fontWeight: 'bolder' }}
                          >
                            {result.expected}
                          </Typography>
                          <br />
                        </>
                      )}
                    </Box>
                  </TabPanel>
                ))}
              </>
            )}
            {(problemSubmissionDetails.status === 'Compilation Error' ||
              problemSubmissionDetails.status === 'Time Limit Exceeded') && (
              <Box style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                <Typography variant="h6" style={{ color: 'gray' }}>
                  Compiler Messages
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {problemSubmissionDetails.status}
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {problemSubmissionDetails.stderr}
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {problemSubmissionDetails.stdout}
                </Typography>
                <br />
                <Typography variant="h6" style={{ color: 'gray' }}>
                  Exit Status
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  1
                </Typography>
                <br />
              </Box>
            )}
          </Box>
        </Container>
        <br />
        <Box style={{ textAlign: 'center' }}>
          <Link href={`/problem/${problemSubmissionDetails.problemId}`}>
            <Typography className={classes.link}>Back to problem</Typography>
          </Link>
        </Box>
        <br />
        <br />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;
  let problemSubmissionDetails = null;

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);

        if (user) {
          user = await developers.get(user.uid);

          // Unaccessed forbidden page
          if (user === undefined) {
            return {
              redirect: {
                permanent: false,
                destination: '/unaccessed_forbidden',
              },
            };
          }

          problemSubmissionDetails = await developers.getProblemSubmissionDetails(
            params.id
          ); // user.id,
        }
        else {
          return {
            redirect: {
              permanent: false,
              destination: '/login',
            },
          };
        }
      } else {
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      problemSubmissionDetails,
      // user,
    },
  };
}
