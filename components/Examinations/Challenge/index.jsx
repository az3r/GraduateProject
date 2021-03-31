import React, { useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Box,
  Typography, Button,
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import dateFormat from 'dateformat';
import { calculateTotalExamTime } from '@libs/client/business';
import { users } from '@libs/client';

const useStyles = makeStyles(() => ({
  tableContainer: {
    borderRadius: 20,
    marginTop: 20,
  },
  table: {
    // minWidth: 650,
    // fontWeight: 'bolder',
  },
  title: {
    color: 'green',
    fontWeight: 'bolder',
  },
  createdDate: {
    color: 'rgb(128, 128, 128)',
  },
  box: {
    color: 'white',
  },
  tableRow: {
    hover: { color: '#7EA5FF' },
  },
  pagination: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const PROBLEM_PER_PAGE = 10;

export default function Examinations({user, exams, arrProblems}) {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage] = useState(
    Math.ceil(exams.length / PROBLEM_PER_PAGE)
  );
  const [examinations, setExaminations] = useState(
    exams.slice(
      (currentPage - 1) * PROBLEM_PER_PAGE,
      currentPage * PROBLEM_PER_PAGE
    ));

  const handleJoinExam = async (examId) => {
    console.log(examId);
    await users.joinExam(user.uid, examId);
    // href={`/examination/${examination.id}`}
  }


  const handlePagination = (e, page) => {
    setCurrentPage(page);

    setExaminations(exams.slice(
      (page - 1) * PROBLEM_PER_PAGE,
      page * PROBLEM_PER_PAGE
    ))
  };

  return (
    <TableContainer
      boxShadow={10}
      component={Box}
      className={classes.tableContainer}
    >
      <Box>
        <Typography
          style={{ marginLeft: 20, marginTop: 20 }}
          variant="h4"
          color="secondary"
        >
          Challenge
        </Typography>
        <pre
          style={{
            marginLeft: 20,
            marginTop: 0,
            color: '#960955',
            fontWeight: 'bold',
            fontSize: 15,
            whiteSpace: 'pre-line',
          }}
        >{`
          Passing an examination,
          you will but only get stronger but also high rank in our ranking.
        `}</pre>
      </Box>
      <hr />
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bolder' }}>Examination</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Duration</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {examinations.map((examination, index) => {
              if (Date.parse(examination.startAt) <= Date.now() && Date.parse(examination.endAt) >= Date.now()) {
                return (
                  <TableRow
                    key={examination.id}
                    className={classes.tableRow}
                    hover
                    style={
                      index % 2
                        ? { background: 'rgb(250, 250, 250)' }
                        : { background: 'white' }
                    }
                  >
                    <TableCell component="th" scope="row">
                      <Link href={`/examination/${examination.id}`} underline="none">
                        <Box>
                          <Box className={classes.title}>{examination.title}</Box>
                          <Box className={classes.createdDate}>
                            {dateFormat(
                              new Date(examination.createdOn),
                              'mmmm dd, yyyy "at" HH:MM TT'
                            )}
                          </Box>
                        </Box>
                      </Link>
                    </TableCell>
                    <TableCell>{calculateTotalExamTime(arrProblems[index]).toString()}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="primary"
                              onClick={() => handleJoinExam(examination.id)}>JOIN</Button>
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            }
          )
          }
        </TableBody>
      </Table>
      <div className={classes.pagination}>
        <Pagination
          onChange={handlePagination}
          count={totalPage}
          page={currentPage}
          variant="outlined"
          color="primary"
        />
      </div>
    </TableContainer>
  );
}
