import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  makeStyles,
  Container,
  Hidden,
  Box,
  Link,
  Typography,
  Grid
} from '@material-ui/core';
import { companies, developers } from '@libs/client';

const Problem = dynamic(() => import('./Problem'), {
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


export default function TestProblemCoding({index, problem, user, onIsSolvedProblemsChange, onNextQuestion }) {   // , problemSubmissionHistory
  const classes = useStyles();


  const [author, setAuthor] = useState({id: "#", name: "#"});
  const [company, setCompany] = useState({name: "#"});

  useEffect(async () => {
    let developer = await developers.get(problem.owner);

    if(developer !== undefined){
      setAuthor(developer);
    }
    else{
      developer = await companies.get(problem.owner);
      if(developer !== undefined){
        setAuthor(developer);
      }
    }


    const comp = await companies.get(problem.companyId);

    if(comp !== undefined){
      setCompany(comp);
    }
  }, []);


  return (
    <>
        <Container maxWidth disableGutters>
          <Grid container>
            <Hidden smDown>
              <Grid item xs={12} container className={classes.subNavBar} direction="row" justify="space-between" alignItems="center">
                <Box style={{marginLeft: 80}}>
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
              <Problem index={index} problem={problem} user={user} onIsSolvedProblemsChange={onIsSolvedProblemsChange} onNextQuestion={onNextQuestion} />
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
    </>
  );
}
