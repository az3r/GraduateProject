import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box, Typography,
} from '@material-ui/core';
import {shadows} from '@material-ui/system';

import Pagination from '@material-ui/lab/Pagination';
import dateFormat from 'dateformat';

const useStyles = makeStyles((theme) => ({
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

const exams = [
  {
    id: 1,
    title: 'Biweekly Examination 1',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 2,
    title: 'Biweekly Examination 2',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 3,
    title: 'Biweekly Examination 3',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 4,
    title: 'Biweekly Examination 4',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 5,
    title: 'Biweekly Examination 5',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 6,
    title: 'Biweekly Examination 6',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 7,
    title: 'Biweekly Examination 7',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 8,
    title: 'Biweekly Examination 8',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 9,
    title: 'Biweekly Examination 9',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  },
  {
    id: 10,
    title: 'Biweekly Examination 10',
    duration: '1 h 30 m',
    createdDate: Date.now(),
  }
];

export default function Examinations() {
  const classes = useStyles();
  const [examinations, setExaminations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);

  useEffect(() => {
    setExaminations(exams);
  })


  return (
    <TableContainer boxShadow={10} component={Box} className={classes.tableContainer}>
      <Box>
        <Typography style={{marginLeft: 20, marginTop: 20}} variant="h4" color="secondary">Challenge</Typography>
        <pre style={{marginLeft: 20, marginTop: 0, color: '#960955', fontWeight: 'bold', fontSize: 15, whiteSpace: 'pre-line'}}>{`
          Passing an examination,
          you will but only get stronger but also high rank in our ranking.
        `}</pre>
      </Box>
      <hr />
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: 'bolder'}}>Examination</TableCell>
            <TableCell style={{fontWeight: 'bolder'}}>Duration</TableCell>
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
                  <Link
                    href={`/examination/${examination.id}`}
                    underline={'none'}
                  >
                    <Box>
                      <Box className={classes.title}>
                        {examination.title}
                      </Box>
                      <Box className={classes.createdDate}>
                        {dateFormat((new Date(examination.createdDate)), 'mmmm dd, yyyy "at" HH:MM TT')}
                      </Box>
                    </Box>
                  </Link>
              </TableCell>
              <TableCell>{examination.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.pagination}>
        <Pagination count={totalPage} page={currentPage} variant="outlined" color="primary" />
      </div>
    </TableContainer>
  );
}
