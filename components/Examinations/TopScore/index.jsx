import React from 'react';
import {
  makeStyles,
  Paper,
  Box,
  Avatar,
  Typography,
  Link,
} from '@material-ui/core';

import {useRouter} from 'next/router';

const useStyles = makeStyles({
  root: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%'
  },
  top1: {
    display: 'flex',
    justifyContent: 'center',
  },
  top23: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  small: {
    width: 32,
    height: 32,
  },
  large: {
    width: 64,
    height: 64,
  },
  topScore: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
  },
  topScoreList: {
    borderRadius: 20,
    backgroundColor: 'rgb(250, 250, 250)',
    borderColor: 'gray',
  },
  topScoreItem: {
    display: 'flex',
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgb(128, 128, 128, 0.5)',
      cursor: 'pointer',
    },
  },
  score: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  viewMore: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    color: 'blue',
  },
});

export default function TopScore({usersExamScore}) {
  const classes = useStyles();
  const router = useRouter();

  const viewMore = () => {
    router.push('/examination/ranking');
  }
  return (
    <>
      <Paper className={classes.root} elevation={3}>
        <Box className={classes.topScore}>
          <img src="/ranking.png" alt="ranking icon" />
          <Typography
            style={{
              display: 'inline',
              fontWeight: 'bolder',
              fontSize: 25,
              marginLeft: 10,
            }}
          >
            TOP SCORE
          </Typography>
        </Box>
        {
          usersExamScore[0] !== undefined &&
          <Box className={classes.top1}>
            <Link href={`/profile/${usersExamScore[0].id}`} underline="none">
              <Avatar
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                className={classes.large}
                alt="avatar"
                src={usersExamScore[0].avatar}
              />
              <Typography>{usersExamScore[0].name} ({usersExamScore[0].examScore})</Typography>
            </Link>
          </Box>
        }
        {
          (usersExamScore[1] !== undefined && usersExamScore[2] !== undefined) &&
          <Box className={classes.top23}>
            <Link href={`/profile/${usersExamScore[1].id}`} underline="none">
              <Avatar
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                className={classes.large}
                alt="avatar"
                src={usersExamScore[1].avatar}
              />
              <Typography>{usersExamScore[1].name} ({usersExamScore[1].examScore})</Typography>
            </Link>
            <Link href={`/profile/${usersExamScore[2].id}`} underline="none">
              <Avatar
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                className={classes.large}
                alt="avatar"
                src={usersExamScore[2].avatar}
              />
              <Typography>{usersExamScore[2].name} ({usersExamScore[2].examScore})</Typography>
            </Link>
          </Box>
        }

        <Box m={1} border={1} className={classes.topScoreList}>
          {
            usersExamScore.map((userexamscore, index) => {
              if(index >= 3 && index <= 14){
                return (
                  <Box key={userexamscore.id} borderBottom={1} className={classes.topScoreItem}>
                    <Typography variant="h6" style={{ margin: 10 }}>
                      {index + 1}
                    </Typography>
                    <Avatar
                      className={classes.small}
                      alt="avatar"
                      src={userexamscore.avatar}
                    />
                    <Typography color="primary" variant="h6" style={{ margin: 10 }}>
                      {userexamscore.name}
                    </Typography>
                    <Box className={classes.score}>
                      {userexamscore.examScore}
                      <img alt="Score" src="/coins_28px.png" />
                    </Box>
                  </Box>
                );
              }
              return false;
            })
          }
          <Box className={[classes.topScoreItem, classes.viewMore]} onClick={() => viewMore()}>
            View More...
          </Box>
        </Box>
      </Paper>
    </>
  );
}
