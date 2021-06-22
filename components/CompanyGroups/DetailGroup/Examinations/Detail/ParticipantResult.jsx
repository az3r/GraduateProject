import {
  Avatar,
  Box,
  Breadcrumbs,
  Divider,
  makeStyles,
  Tabs,
  Tab,
  Typography,
  Link as MLink,
  Button,
} from '@material-ui/core';
import dateFormat from 'dateformat';
import React, { useEffect, useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';
import { find } from '@libs/client/users';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { sendResults } from '@libs/client/business';
import PieChart from './PieChart';

const useStyle = makeStyles((theme) => ({
  centerText: {
    textAlign: 'center',
  },
  avatar: {
    width: '90px',
    height: '90px',
  },
  spacing: {
    marginBottom: '30px',
  },
  centerPage: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  examineeTable: {
    width: '50%',
    border: '1px solid black',
    borderCollapse: 'collapse',
    textAlign: 'left',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },

  correct: {
    color: 'green',
  },
  incorrect: {
    color: 'red',
  },
  case: {
    marginRight: '10px',
  },
  passCase: {
    backgroundColor: 'green',
    color: 'white',
  },
  failCase: {
    backgroundColor: 'red',
    color: 'white',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabContent: {
    width: '85%',
    overflow: 'scroll',
    overflowX: 'hidden',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 500,
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

export default function ResultPage({ submission, examTitle, questions }) {
  const classes = useStyle();
  const router = useRouter();
  const [valueTab, setValueTab] = useState(0);
  const { id, exam, uid } = router.query;
  const [dev, setDev] = useState({});

  useEffect(async () => {
    setDev(await find(uid));
  }, []);

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleSendResults = () => {
    const date = dateFormat(
      new Date(submission.createdOn),
      'HH:MM TT, dd-mmmm-yyyy'
    )
    sendResults(dev.name,submission.examId,examTitle,date,submission.score,dev.email);
  };

  return (
    <Box m={1} p={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link color="inherit" href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link color="inherit" href={`/company-groups/${id}/examinations`}>
          <Typography className={classes.linkStyle}>Examinations</Typography>
        </Link>
        <Link
          color="inherit"
          href={`/company-groups/${id}/examinations/detail?exam=${exam}`}
        >
          <Typography className={classes.linkStyle}>Detail</Typography>
        </Link>
        <Typography color="textPrimary">Result</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />

      <Typography
        variant="h4"
        className={[classes.centerText, classes.spacing].join(' ')}
        color="primary"
      >
        Examination Result Report
      </Typography>
      <Avatar
        className={[classes.avatar, classes.centerPage, classes.spacing].join(
          ' '
        )}
        alt="Remy Sharp"
        src={dev.avatar}
      />
      <table
        className={[
          classes.examineeTable,
          classes.centerPage,
          classes.spacing,
        ].join(' ')}
      >
        <tr>
          <th className={classes.examineeTable}>Name:</th>
          <td className={classes.examineeTable}>
            <MLink target="_blank" href={`/profile/dev/${dev.id}`}>
              <Typography>{dev.name}</Typography>
            </MLink>
          </td>
        </tr>
        <tr>
          <th className={classes.examineeTable}>Email:</th>
          <td className={classes.examineeTable}>
            <Typography>{dev.email}</Typography>
          </td>
        </tr>
        <tr>
          <th className={classes.examineeTable}>Examination ID:</th>
          <td className={classes.examineeTable}>
            <Typography>{exam}</Typography>
          </td>
        </tr>
        <tr>
          <th className={classes.examineeTable}>Submitted at:</th>
          <td className={classes.examineeTable}>
            <Typography>
              {dateFormat(
                new Date(submission.createdOn),
                'HH:MM TT, dd-mmmm-yyyy'
              )}
            </Typography>
          </td>
        </tr>
        <tr>
          <th className={classes.examineeTable}>Score:</th>
          <td className={classes.examineeTable}>
            <Typography>{submission.score}</Typography>
          </td>
        </tr>
      </table>

      <Box mt={3} p={2} display="flex" justifyContent="center">
        <PieChart data={getChartData(submission.correct, submission.total)} />
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography style={{ textAlign: 'center' }}>
          <b>Total:</b> {submission.total} - <b>Corrects:</b>{' '}
          {submission.correct} - <b>Wrongs:</b>{' '}
          {submission.total - submission.correct}
        </Typography>
      </Box>
      <Box boxShadow={2} mt={3} className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={valueTab}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {submission.results.map((item, index) => (
            <Tab
              label={`Question ${index + 1}`}
              icon={getResultTabIcon(item)}
            />
          ))}
        </Tabs>

        {submission.results.map((item, idx) => (
          <TabPanel className={classes.tabPane} value={valueTab} index={idx}>
            {getDetailResult(item, questions[idx])}
          </TabPanel>
        ))}
      </Box>
      <Box mt={3} p={2} display="flex" justifyContent="center">
        <Button color="primary" variant="outlined" onClick={handleSendResults}>
          Send results email
        </Button>
      </Box>
    </Box>
  );
}

function getDetailResult(item, problem) {
  const classes = useStyle();
  const [valueTab, setValueTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };
  if (item === null) {
    return (
      <Box p={2}>
        <Typography className={classes.incorrect}>
          Submission for this question is empty
        </Typography>
      </Box>
    );
  }
  if (item.isMCQ) {
    return (
      <Box p={2}>
        <Typography variant="h6">{HTMLReactParser(problem.title)}</Typography>
        <ol type="A">
          <li>{HTMLReactParser(problem.answers.A)}</li>
          <li>{HTMLReactParser(problem.answers.B)}</li>
          <li>{HTMLReactParser(problem.answers.C)}</li>
          <li>{HTMLReactParser(problem.answers.D)}</li>
        </ol>
        <Typography>
          <b>Correct:</b> {item.details.correctAnswer}
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography>
          <b>Selected:</b> {item.details.selectedAnswer}
        </Typography>
      </Box>
    );
  }
  return (
    <Box p={2}>
      <Typography variant="h6">{problem.title}</Typography>
      {HTMLReactParser(problem.content)}
      <br />
      <Divider />
      <br />
      <b>Code submitted:</b>
      <pre>{item.details.code}</pre>
      <br />
      <Divider />
      <br />
      <Box display="flex" flexWrap="wrap">
        {item.details.results?.length > 0 ? (
          <div className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={valueTab}
              onChange={handleChangeTab}
              aria-label="Vertical tabs example"
              className={classes.tabs}
            >
              {item.details.results.map((value, index) => (
                <Tab
                  label={`Test case ${index + 1}`}
                  icon={getTestCaseTabIcon(value)}
                />
              ))}
            </Tabs>
            {item.details.results.map((value, idx) => (
              <TabPanel value={valueTab} index={idx}>
                <Typography variant="h6" style={{ color: 'gray' }}>
                  Input (stdin)
                </Typography>
                <pre style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {value.input}
                </pre>
                <br />
                <Typography variant="h6" style={{ color: 'gray' }}>
                  Your Output (stdout)
                </Typography>
                <pre style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                  {value.passed ? value.expected : value.actual}
                </pre>
                {!value.passed ? (
                  <>
                    <Typography variant="h6" style={{ color: 'gray' }}>
                      Expected Output
                    </Typography>
                    <pre style={{ marginLeft: 20, fontWeight: 'bolder' }}>
                      {value.expected}
                    </pre>{' '}
                  </>
                ) : null}

                <br />
              </TabPanel>
            ))}
          </div>
        ) : (
          <Typography className={classes.incorrect}>{item.status}</Typography>
        )}
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyle();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className={classes.tabContent}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function getResultTabIcon(result) {
  const classes = useStyle();
  if (result === null) return <CloseIcon className={classes.incorrect} />;
  
  switch (result.status) {
    case true:
      return <CheckIcon className={classes.correct} />;
    case 'Accepted':
      return <CheckIcon className={classes.correct} />;
    default:
      return <CloseIcon className={classes.incorrect} />;
  }
}

function getTestCaseTabIcon(result) {
  const classes = useStyle();
  switch (result.passed) {
    case true:
      return <CheckIcon className={classes.correct} />;
    default:
      return <CloseIcon className={classes.incorrect} />;
  }
}

function getChartData(correct, total) {
  let data;
  if (correct === 0) data = [{ name: 'Wrongs', value: total }];
  else
    data =
      correct === total
        ? [{ name: 'Corrects', value: correct }]
        : [
            { name: 'Corrects', value: correct },
            { name: 'Wrong', value: total - correct },
          ];
  return data;
}
