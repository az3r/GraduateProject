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
import { users } from '@libs/client';
import { useRouter  } from 'next/router';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

export default function Challenge({user, exams}) {
  const router = useRouter();

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

  const MySwal = withReactContent(Swal);

  const handleJoinExam = async (examId) => {
    if(user){
      await users.joinExam(user.uid, examId);
      router.push(`/examination/${examId}`);
    }
    else{
      MySwal.fire({
        title: <p>You have not logged in yet, please log into your account!</p>,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then((result) => {
        if(result.isConfirmed){
          router.push('/login');
        }
      });
    }
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
                      <Link onClick={() => handleJoinExam(examination.id)} style={{cursor: 'pointer'}}  underline="none">
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
                    <TableCell>1h 20m 0s</TableCell>
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
