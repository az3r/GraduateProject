import {
  Avatar,
  Box,
  Breadcrumbs,
  Divider,
  makeStyles,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link as MLink
} from '@material-ui/core';
import dateFormat from 'dateformat';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { find } from '@libs/client/users';
import Link from 'next/link';
import clsx from 'clsx';
import PieChart from '../../Examinations/Detail/PieChart';

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
  accepted: {
    color: 'green',
  },
  wrong: {
    color: 'red',
  },
  compileError: {
    color: 'orange',
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
  titleCol: {
    whiteSpace: 'nowrap',
    width: 550,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default function Index({ submission }) {
  const classes = useStyle();
  const router = useRouter();
  const { id, question, uid } = router.query;
  const [dev, setDev] = useState({});

  useEffect(async () => {
    const devDB = await find(uid);
    setDev(devDB);
  }, []);

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
        <Typography color="textPrimary">Result</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Typography
        variant="h4"
        className={[classes.centerText, classes.spacing].join(' ')}
      >
        Question Submissions Report
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
      </table>

      <Box mt={3} p={2} display="flex" justifyContent="center">
        <PieChart data={getDataChart(submission)} />
      </Box>

      <Box display="flex" justifyContent="center">
        <Typography style={{ textAlign: 'center' }}>
          Total: {submission.length} - Accepted:{' '}
          {submission.filter((item) => item.status === 'Accepted').length} -
          Wrong:{' '}
          {submission.filter((item) => item.status === 'Wrong Answer').length} -
          Compilation Error:{' '}
          {
            submission.filter((item) => item.status === 'Compilation Error')
              .length
          }
        </Typography>
      </Box>

      <Box m={3}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bolder' }}>
                Submissions
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>
                Submitted date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submission.map((item, index) => (
              <TableRow
                className={classes.tableRow}
                hover
                style={
                  index % 2
                    ? { background: 'rgb(250, 250, 250)' }
                    : { background: 'white' }
                }
              >
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.linkStyle}
                >
                  <MLink target="_blank" href={`/company-groups/${id}/questions-bank/submission?question=${question}&subid=${item.id}&uid=${uid}`}>
                    <div className={classes.titleCol}>Submission {index + 1}</div>
                  </MLink>
                </TableCell>
                <TableCell>
                  <Typography
                    className={clsx({
                      [classes.accepted]: item.status === 'Accepted',
                      [classes.wrong]: item.status === 'Wrong Answer',
                      [classes.compileError]:
                        item.status === 'Compilation Error',
                    })}
                  >
                    {item.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {dateFormat(
                      new Date(item.createdOn),
                      'HH:MM TT, dd-mmmm-yyyy'
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

function getDataChart(submission) {
  const accepted = submission.filter((item) => item.status === 'Accepted')
    .length;
  const wrong = submission.filter((item) => item.status === 'Wrong Answer')
    .length;
  const error = submission.filter((item) => item.status === 'Compilation Error')
    .length;
  return [
    {
      name: 'Accepted',
      value: accepted,
    },
    {
      name: 'Wrong Answer',
      value: wrong,
    },
    {
      name: 'Compilation Error',
      value: error,
    },
  ];
}
