import React, { useState } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Container,
  Link,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Typography
} from '@material-ui/core';
import AppLayout from '@components/Layout';
import { developers } from '@libs/client';
import dateFormat from 'dateformat';
import { parseCookies } from '@client/cookies';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  link:  {
    fontWeight: 'bolder',
    cursor: 'pointer',
  },
  pagination: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const SUBMISSION_PER_PAGE = 10;

export default function Submissions({problemSubmissions}) {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage] = useState(
    Math.ceil(problemSubmissions.length / SUBMISSION_PER_PAGE)
  );
  const [submissions, setSubmissions] = useState(
    problemSubmissions.slice(
      (currentPage - 1) * SUBMISSION_PER_PAGE,
      currentPage * SUBMISSION_PER_PAGE
    ));

  const handlePagination = (e, page) => {
    setCurrentPage(page);

    setSubmissions(problemSubmissions.slice(
      (page - 1) * SUBMISSION_PER_PAGE,
      page * SUBMISSION_PER_PAGE
    ));
  };

  return (
    <>
      <Head>
        <title>Submissions | Smart Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container maxWidth="lg">
          <Typography style={{marginTop: 20, marginBottom: 20}} variant="h4">All Submissions</Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="medium" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Problem</TableCell>
                  <TableCell>Created On</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission, index) => {
                  if(index > 9){
                    return null;
                  }
                  return (
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
                        <Link underline="none" href={`/problem/${submission.problemId}`}>
                          <Typography className={classes.link} style={{color: 'blue'}}>
                            {submission.problemName}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {dateFormat(
                          new Date(submission.createdOn),
                          'mmmm dd, yyyy "at" HH:MM TT'
                        )}
                      </TableCell>
                      <TableCell>
                        <Link underline="none" href={`/problem/submissiondetail/${submission.id}`}>
                          {
                            submission.status === "Accepted" &&
                            <Typography  className={classes.link}>
                              {submission.status}
                            </Typography>
                          }
                          {
                            submission.status === "Wrong Answer" &&
                            <Typography  className={classes.link} style={{color: 'orange'}}>
                              {submission.status}
                            </Typography>
                          }
                          {
                            submission.status === "Compilation Error" &&
                            <Typography  className={classes.link} style={{color: 'red'}}>
                              {submission.status}
                            </Typography>
                          }
                        </Link>
                      </TableCell>
                      <TableCell>{submission.language}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>
                        <Button href={`/problem/submissiondetail/${submission.id}`} variant="outlined" color='primary'>View Results</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
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
        </Container>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let problemSubmissions = [];

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);


        if(user){
          user = await developers.get(user.uid);

          // Unaccessed forbidden page
          if(user === undefined){
            return {
              redirect: {
                permanent: false,
                destination: "/unaccessed_forbidden"
              }
            }
          }

          // Get all problem submissions
          problemSubmissions = await developers.getAllProblemSubmissions(user.id, false);
        }
      }
      else{
        return {
          redirect: {
            permanent: false,
            destination: "/login"
          }
        }
      }
    }
    else{
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      }
    }
  } catch (e) {
    console.log(e);
  }


  return {
    props: {
      problemSubmissions
    },
  };
}
