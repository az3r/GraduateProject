import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Link,
  makeStyles,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import dateFormat from 'dateformat';
import React, { useEffect, useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';
import { find } from '@libs/client/users';
import PieChart from './PieChart';

const useStyle = makeStyles((theme) => ({
  centerText: {
    textAlign: 'center',
  },
  avatar: {
    width: '70px',
    height: '70px',
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
}));

export default function ResultPage({ submission }) {
  const classes = useStyle();
  const router = useRouter();
  const [valueTab, setValueTab] = useState(0);
  const { id, exam, uid } = router.query;
  const [dev, setDev] = useState({});

  useEffect(async () => {
    const devDB = await find(uid);
    setDev(devDB);
  }, []);

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  return (
    <Box m={1} p={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          Company groups
        </Link>
        <Link color="inherit" href={`/company-groups/${id}`}>
          Current group
        </Link>
        <Link color="inherit" href={`/company-groups/${id}/examinations`}>
          Examinations
        </Link>
        <Link
          color="inherit"
          href={`/company-groups/9UAoBzvkF8QULevb2ZR4Y36HBsF3/examinations/detail?exam=${exam}`}
        >
          Detail
        </Link>
        <Typography color="textPrimary">Result</Typography>
      </Breadcrumbs>
      <br/>
      <Divider />
      <br/>

      <Typography
        variant="h4"
        className={[classes.centerText, classes.spacing].join(' ')}
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
            <Typography>{dev.name}</Typography>
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
      </table>

      <Box mt={3} p={2} display="flex" justifyContent="center">
        <PieChart data={getChartData(submission.correct, submission.total)} />
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography style={{ textAlign: 'center' }}>
          <b>Corrects:</b> {submission.correct} - <b>Total:</b> {submission.total}
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
            {item.isMCQ ? (
              <Box p={2}>
                <Typography>
                  <b>Correct answer:</b> {item.details.correctAnswer}
                </Typography>
                <Typography>
                  <b>Selected answer:</b> {item.details.selectedAnswer}
                </Typography>
              </Box>
            ) : (
              <Box p={2}>
                <b>Code:</b>
                <pre>{item.details.code}</pre>
                <Divider />
                <b>Test cases:</b>
                <ul>
                  <li>Passed: {item.details.passed}</li>
                  <li>Failed: {item.details.failed}</li>
                </ul>
                <Box display="flex" flexWrap="wrap">
                  {item.details.results.map((testCase, k) => (
                    <Chip
                      label={`Test case ${k + 1}`}
                      className={[
                        testCase.passed ? classes.passCase : classes.failCase,
                        classes.case,
                      ].join(' ')}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </TabPanel>
        ))}
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
  switch (result.status) {
    case true:
      return <CheckIcon className={classes.correct} />;
    case 'Accepted':
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
            { name: 'Total', value: total },
          ];
  return data;
}
