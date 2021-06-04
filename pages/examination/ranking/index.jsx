import React, { useState } from 'react';

import Head from 'next/head';
import {
  makeStyles,
  Container,
  Link, Avatar, Grid,
} from '@material-ui/core';

import AppLayout from '@components/Layout';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Pagination from '@material-ui/lab/Pagination';

import { developers } from '@libs/client';
import { parseCookies } from '@client/cookies';

const useStyles = makeStyles({
  userBox: {
    display: 'flex',
    alignItems: 'center',
    borderBottomColor: 'gray',
    paddingBottom: 10,
    paddingTop: 10,
  },
  scoreAvatar: {
    height: 25,
    width: 25,
  },
  scoreBox: {
    display: 'flex',
    fontSize: 18,
    marginRight: 30,
  },
  pagination: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const USERS_SCORE_PER_PAGE = 10;

export default function Ranking({usersExamScore}) {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage] = useState(
    Math.ceil(usersExamScore.length / USERS_SCORE_PER_PAGE)
  );
  const [pagedUsersExamScore, setPagedUsersExamScore] = useState(
    usersExamScore.slice(
      (currentPage - 1) * USERS_SCORE_PER_PAGE,
      currentPage * USERS_SCORE_PER_PAGE
    )
  );


  const handlePagination = (e, page) => {
    setCurrentPage(page);
    setPagedUsersExamScore(usersExamScore.slice(
      (page - 1) * USERS_SCORE_PER_PAGE,
      page * USERS_SCORE_PER_PAGE
    ));
  };

  return (
    <>
      <Head>
        <title>Ranking | Smart Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb" style={{marginTop: 30}}>
            <Link color="inherit" href="/" onClick={preventDefault}>
              Home
            </Link>
            <Link color="inherit" href="/examination" onClick={preventDefault}>
              Examination
            </Link>
            <Link
              color="textPrimary"
              href="/examination/ranking/"
              onClick={preventDefault}
              aria-current="page"
            >
              Ranking
            </Link>
          </Breadcrumbs>
          <Grid container justify='center'>
            <Grid item xm={12} md={8} >
              <h1 style={{marginLeft: 20, color: 'green'}}>Examination Ranking</h1>
              <Box style={{marginLeft: 20, color: 'gray'}}>Total Participants: {usersExamScore.length}</Box>
              {
                pagedUsersExamScore.map((userScore, index) => (
                  <Box key={userScore.id} className={classes.userBox} borderBottom={1}>
                    <Box style={{marginLeft: 30, marginRight: 30}}>
                      {(currentPage - 1)*10 + index + 1}
                    </Box>
                    <Avatar variant="circular" src={userScore.avatar} />
                    <Box style={{marginRight: 'auto'}}>
                      <h3 style={{display: 'inline-block', marginLeft: 20, marginRight: 0, marginTop: 0, marginBottom: 0}}>
                        <a href={`/profile/dev/${userScore.id}`} style={{color: 'green', textDecoration: 'none'}}>{userScore.name}</a>
                      </h3>
                      {
                        userScore.joinedExams === undefined &&
                        <Box style={{color: 'gray', marginLeft: 20}}>0 examinations attended</Box>
                      }
                      {
                        userScore.joinedExams !== undefined &&
                        <Box style={{color: 'gray', marginLeft: 20}}>{userScore.joinedExams.length} examinations attended</Box>
                      }
                    </Box>
                    <Box className={classes.scoreBox}>
                      <Box p="4px">
                        {userScore.examScore}
                      </Box>
                      <Avatar className={classes.scoreAvatar} alt="Score" src="/coins_48px.png" />
                    </Box>
                  </Box>
                ))
              }
              <Box className={classes.pagination}>
                <Pagination
                  onChange={handlePagination}
                  count={totalPage}
                  page={currentPage}
                  variant="outlined"
                  color="primary"
                />
              </Box>
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
        }
        else {
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

  const usersExamScore = await developers.getUserByExamScore();

  return {
    props: {
      usersExamScore
    },
  };
}

