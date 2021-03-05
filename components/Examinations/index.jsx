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

export default function Examinations({exams}) {
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
          {examinations.map((examination, index) => (
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
              <TableCell>{examination.duration}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="primary" href={`/examination/${examination.id}`}>JOIN</Button>
              </TableCell>
            </TableRow>
          ))}
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
