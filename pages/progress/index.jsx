import React, { useState } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Container,
  Link,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Box,
  Typography
} from '@material-ui/core';
import AppLayout from '@components/Layout';
import { developers, problems as probs } from '@libs/client';
import { PieChart, Pie, Cell } from 'recharts';
import dateFormat from 'dateformat';
import { parseCookies } from '@client/cookies';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if(index === 0){
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`ToDo ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }
  if(index === 1){
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`Solved ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`Attempted ${(percent * 100).toFixed(0)}%`}
      </text>
    );

};

const useStyles = makeStyles({
  caption: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  captionItem: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link:  {
    fontWeight: 'bolder',
    cursor: 'pointer',
  }
});


export default function YourProgress({ user, acceptedProblemSubmissions, submissionsNumber, acceptedSubmissionsNumber, problemsNumber, solvedProblemsNumber, unsolvedProblemsNumber,}) {
  const classes = useStyles();
  const [data] = useState([
    { name: 'ToDo', value: problemsNumber - solvedProblemsNumber - unsolvedProblemsNumber },
    { name: 'Solved', value: solvedProblemsNumber },
    { name: 'Attempted', value: unsolvedProblemsNumber },
  ]);


  return (
    <>
      <Head>
        <title>Your Progress | Smart Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container maxWidth="lg">
          <Grid>
            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item sx={12} md={4}>
                    <PieChart width={350} height={350}>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell fill={COLORS[index % COLORS.length]} /> // key={`cell-${index}`}
                        ))}
                      </Pie>
                    </PieChart>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container direction="row" spacing={5}>
                    <Grid item xs={12}>
                      <Box className={classes.captionItem}>
                        {
                          user.problemScore &&
                          <Typography variant="h2" style={{ color: COLORS[2] }}>{user.problemScore}</Typography>
                        }
                        {
                          user.problemScore === undefined &&
                          <Typography variant="h2" style={{ color: COLORS[2] }}>0</Typography>
                        }
                        <Typography variant="h6">Score</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className={classes.captionItem}>
                        <Typography variant="h2" style={{ color: COLORS[1] }}>{solvedProblemsNumber}<span style={{fontSize: 20, color: 'black'}}>/{ problemsNumber }</span></Typography>
                        <Typography variant="h6">Problem Solved</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className={classes.captionItem}>
                        <Typography variant="h2" style={{ color: COLORS[0] }}>{submissionsNumber}</Typography>
                        <Typography variant="h6">Total Submissions</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className={classes.captionItem}>
                        <Typography variant="h2" style={{ color: COLORS[1] }}>{acceptedSubmissionsNumber}</Typography>
                        <Typography variant="h6">Accepted Submissions</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">Most Recent 10 Accepted Submissions</Typography>
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
                    {acceptedProblemSubmissions.map((submission, index) => {
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
                          <TableCell>{index + 1}</TableCell>
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
                              <Typography  className={classes.link}>
                                {submission.status}
                              </Typography>
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
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);
  let user = null;
  let acceptedProblemSubmissions = [];
  let submissionsNumber = 0;
  let acceptedSubmissionsNumber = 0;
  let problemsNumber = 0;
  let solvedProblemsNumber = 0;
  let unsolvedProblemsNumber = 0;

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
          const problemSubmissions = await developers.getAllProblemSubmissions(user.id, false);
          submissionsNumber = problemSubmissions.length;

          // Get all problem submissions accepted
          acceptedProblemSubmissions = await developers.getAllProblemSubmissions(user.id, true);
          acceptedSubmissionsNumber = acceptedProblemSubmissions.length;

          // Get all problems
          const items = await probs.getPublishedProblems();
          problemsNumber = items.length;

          // Get solved problems
          const solvedProblems = await developers.getSolvedProblems(user.id);
          solvedProblemsNumber = solvedProblems.length;

          // Get unsolved problems
          const unsolvedProblems = await developers.getUnsolvedProblems(user.id);
          unsolvedProblemsNumber = unsolvedProblems.length;

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

  console.log(acceptedProblemSubmissions);

  return {
    props: {
      user,
      acceptedProblemSubmissions,
      submissionsNumber,
      acceptedSubmissionsNumber,
      problemsNumber,
      solvedProblemsNumber,
      unsolvedProblemsNumber,
    },
  };
}

