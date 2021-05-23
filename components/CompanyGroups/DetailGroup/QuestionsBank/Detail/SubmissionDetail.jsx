import {
  Box,
  Breadcrumbs,
  Divider,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import dateFormat from 'dateformat';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const useStyle = makeStyles({
  container: {
    width: '70%',
    margin: 'auto'
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  root2: {
    flexGrow: 1,
    backgroundColor: 'white',
    display: 'flex',
    height: 350,
  },
  tabs: {
    backgroundColor: 'lightgray',
  },
});

export default function Index({ submission }) {
  const [value, setValue] = useState(0);
  const classes = useStyle();
  const router = useRouter();
  const { id, question, uid } = router.query;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box m={1} p={2}>
      <Breadcrumbs>
        <Link href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}> Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/questions-bank`}>
          <Typography className={classes.linkStyle}>Questions bank</Typography>
        </Link>
        <Link
          href={`/company-groups/${id}/questions-bank/detail?question=${question}`}
        >
          <Typography className={classes.linkStyle}>Detail</Typography>
        </Link>
        <Link
          href={`/company-groups/${id}/questions-bank/result?question=${question}&uid=${uid}`}
        >
          <Typography className={classes.linkStyle}>Result</Typography>
        </Link>
        <Typography color="textPrimary">Submission</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Box boxShadow={3} p={3} className={classes.container}>
        <Box border={1} p={2}>
          <Typography variant="subtitle1">
            Submitted on
            {` ${dateFormat(
              new Date(submission.createdOn),
              'mmmm dd, yyyy "at" HH:MM TT'
            )}`}
          </Typography>
          <Typography variant="h6" style={{ marginRight: 30 }}>
            Language:{' '}
            <span style={{ fontWeight: 'normal', color: 'gray' }}>
              {submission.language}
            </span>
          </Typography>
          <Box style={{ display: 'flex' }}>
            <Typography variant="h6" style={{ marginRight: 30 }}>
              Score:{' '}
              <span style={{ fontWeight: 'normal', color: 'gray' }}>
                {submission.score}
              </span>
            </Typography>
            <Typography variant="h6" style={{ marginRight: 30 }}>
              Status:
              {submission.status === 'Accepted' && (
                <span
                  style={{ color: 'green' }}
                >{` ${submission.status}`}</span>
              )}
              {submission.status === 'Wrong Answer' && (
                <span
                  style={{ color: 'orange' }}
                >{` ${submission.status}`}</span>
              )}
              {submission.status === 'Compilation Error' ||
              submission.status === 'Time Limit Exceeded' ? (
                <span style={{ color: 'red' }}>{` ${submission.status}`}</span>
              ) : null}
            </Typography>
          </Box>

          <Box style={{ display: 'flex' }}>
            {' '}
            <Typography variant="h6" style={{ marginRight: 30 }}>
              Runtime:{' '}
              {submission.results ? (
                <span style={{ fontWeight: 'normal', color: 'gray' }}>
                  {submission.totalElapsedTime} ms
                </span>
              ) : (
                'N/A'
              )}
            </Typography>
            <Typography variant="h6" style={{ marginRight: 30 }}>
              {(submission.status === 'Accepted' ||
                submission.status === 'Wrong Answer') && (
                <>
                  {submission.passed} / {submission.total}
                  <span style={{ fontWeight: 'normal', color: 'gray' }}>
                    {' test cases passed.'}
                  </span>
                </>
              )}
            </Typography>
          </Box>
        </Box>
        <br />
        <Box>
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
            <pre>{submission.code}</pre>
          </Box>
          <Box boxShadow={3} className={classes.root2}>
            {(submission.status === 'Accepted' ||
              submission.status === 'Wrong Answer') && (
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
                  {submission.results.map((result, index) => {
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
                {submission.results.map((result, index) => (
                  <TabPanel value={value} index={index}>
                    <Box
                      style={{
                        paddingLeft: 50,
                        paddingRight: 50,
                        paddingTop: 50,
                        overflow: 'auto',
                        maxHeight: 350,
                        width: '100%'
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
            {submission.status === 'Compilation Error' ||
            submission.status === 'Time Limit Exceeded' ? (
              <Box
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 20,
                  overflow: 'scroll',
                }}
              >
                <Typography variant="h6" style={{ color: 'gray' }}>
                  Compiler Messages
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {submission.status}
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {submission.stderr}
                </Typography>
                <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {submission.stdout}
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
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;

  return <div>{value === index && <Box>{children}</Box>}</div>;
}
