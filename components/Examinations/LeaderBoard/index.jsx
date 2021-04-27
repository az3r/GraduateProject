import React, {  useState } from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  Link, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import dateFormat from 'dateformat';
import {  formatTime } from '@client/business';

const useStyles = makeStyles({
  pagination: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    hover: { color: '#7EA5FF' },
  },
  link: {
    color: 'green',
    cursor: 'pointer',
  },
});

const PROBLEM_PER_PAGE = 10;

export default function LeaderBoard({examSubmissions}) {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage] = useState(
    Math.ceil(examSubmissions.length / PROBLEM_PER_PAGE)
  );
  const [submissions, setSubmissions] = useState(
    examSubmissions.slice(
      (currentPage - 1) * PROBLEM_PER_PAGE,
      currentPage * PROBLEM_PER_PAGE
    ));

  const handlePagination = (e, page) => {
    setCurrentPage(page);

    setSubmissions(examSubmissions.slice(
      (page - 1) * PROBLEM_PER_PAGE,
      page * PROBLEM_PER_PAGE
    ));
  };


  return (
    <>
      <Typography variant="subtitle1">There are {examSubmissions.length} participants!</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Developer</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission, index) => (
                <TableRow
                  key={submission.id}
                  className={classes.tableRow}
                  hover
                  style={
                    index % 2
                      ? { background: 'rgb(250, 250, 250)' }
                      : { background: 'white' }
                  }
                >
                  <TableCell>{(currentPage - 1)*10 + index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    <Link href={`/profile/${submission.id}`}>
                      <Typography className={classes.link}>
                        {submission.name}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {dateFormat(
                    new Date(submission.createdOn),
                    'mmmm dd, yyyy "at" HH:MM TT'
                  )}
                  </TableCell>
                  <TableCell>{formatTime(submission.time)}</TableCell>
                  <TableCell>{submission.examScore}</TableCell>
                </TableRow>
              ))
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
    </>
  );
}
