import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { problems } from '@libs/client';
import { parseCookies } from '@libs/client/cookies';
import {
  makeStyles,
  Container,
  Hidden,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Grid
} from '@material-ui/core';
import AppLayout from '../../components/Layout';

const Problem = dynamic(() => import('../../components/Problems/Problem/index'), {
  ssr: false,
});



const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  subNavBar: {
    backgroundColor: 'white',
    height: 100,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));


export default function Test({ problem, user }) {   // , problemSubmissionHistory
  const classes = useStyles();

  const [author] = useState({id: "#", name: "#"});
  const [company] = useState({name: "#"});

  useEffect(async () => {
    // const developer = await developers.get(problem.developerId);
    //
    // if(developer !== undefined){
    //   setAuthor(developer);
    // }

    // const company = await developers.get(problem.companyId);
    //
    // if(company !== undefined){
    //   setCompany(company);
    // }
  }, []);


  return (
    <>
      <Head>
        <title>Problems | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container maxWidth="xl" disableGutters>
          <Grid container>
            <Hidden smDown>
              <Grid item xs={12} container className={classes.subNavBar} direction="row" justify="space-between" alignItems="center">
                  <Box style={{marginLeft: 80}}>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link color="inherit" href="/"  >
                        Home
                      </Link>
                      <Link color="inherit" href="/" >
                        Problem
                      </Link>
                      <Typography color="textPrimary">{problem.title}</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" style={{fontWeight: "bolder"}}>{problem.title}</Typography>
                  </Box>
                {/* { */}
                {/*  problem.language === 'Java' && */}
                {/*  <Avatar style={{marginRight: 80}} alt="Remy Sharp" src="/java.png" /> */}
                {/* } */}
                {/* { */}
                {/*  problem.language === 'Csharp' && */}
                {/*  <Avatar style={{marginRight: 80}} alt="Remy Sharp" src="/c.png" /> */}
                {/* } */}
                {/* { */}
                {/*  problem.language === 'Python' && */}
                {/*  <Avatar style={{marginRight: 80}} alt="Remy Sharp" src="/python.png" /> */}
                {/* } */}
              </Grid>
            </Hidden>
            <Grid item xs={12} md={9}>
              <Problem problem={problem} user={user} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box className={classes.root}>
                <Box className={classes.info}>
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Author</Typography>
                  <Link href={`/profile/${author.id}`} variant="body2">{author.name}</Link>
                </Box>
                <hr />
                <Box className={classes.info}>
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Company</Typography>
                  <Typography>{company.name}</Typography>
                </Box>
                <hr />
                <Box className={classes.info}>
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Difficulty</Typography>
                  {
                    problem.difficulty === 0 &&
                    <Typography style={{color: 'green', fontWeight: 'bolder'}}>Easy</Typography>
                  }
                  {
                    problem.difficulty === 1 &&
                    <Typography style={{color: 'orange', fontWeight: 'bolder'}}>Medium</Typography>
                  }
                  {
                    problem.difficulty === 2 &&
                    <Typography style={{color: 'red', fontWeight: 'bolder'}}>Hard</Typography>
                  }
                </Box>
                <hr />
                <Box className={classes.info}>
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Max Score</Typography>
                  <Typography>{problem.score}</Typography>
                </Box>
                <hr />
                <Box className={classes.info}>
                  <Typography style={{color: 'green', fontWeight: 'bolder'}}>Programing Language</Typography>
                  <Typography>{problem.language}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <br />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const cookies = parseCookies(req);
  let user = null;
  // let problemSubmissionHistory = null;
  let item = [];
  try {
    item = await problems.get({problem: undefined, problemId: params.id});
    console.dir(item);

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
        // problemSubmissionHistory = await submissions.getProblemSubmissions(
        //   user.uid,
        //   params.id
        // );
      }
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      problem: item,
      user,
      // problemSubmissionHistory,
    },
  };
}
