import React from 'react';
import {
  makeStyles,
  Paper,
  Box,
  Avatar, Typography, Link,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    marginTop: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
    "&:hover": {
      backgroundColor: 'rgb(128, 128, 128, 0.5)',
      cursor: 'pointer',
    }
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

export default function TopScore() {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.root} elevation={20}>
        <Box className={classes.topScore}>
          <img src="/ranking.png"></img>
          <Typography style={{display: 'inline', fontWeight: 'bolder', fontSize: 25, marginLeft: 10}}>TOP SCORE</Typography>
        </Box>
        <Box className={classes.top1}>
          <Link
            href={`/avatar`}
            underline={'none'}
          >
            <Avatar style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} className={classes.large} alt="avatar" src="https://picsum.photos/200" />
            <Typography>maykase (120)</Typography>
          </Link>
        </Box>
        <Box className={classes.top23}>
          <Link
            href={`/avatar`}
            underline={'none'}
          >
            <Avatar style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} className={classes.large} alt="avatar" src="https://picsum.photos/201" />
            <Typography>hakachi (120)</Typography>
          </Link>
          <Link
            href={`/avatar`}
            underline={'none'}
          >
            <Avatar style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} className={classes.large} alt="avatar" src="https://picsum.photos/202" />
            <Typography>masura (120)</Typography>
          </Link>
        </Box>

        <Box m={1} border={1} className={classes.topScoreList}>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>4</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/304" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>JOHNKRAM</Typography>
            <Box className={classes.score}>
                120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>5</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/305" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>tmwilliamlin168</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>6</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/306" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>uwi</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>7</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/307" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>natsugiri</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>8</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/308" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>hitonanode</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>9</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/309" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>huzecong</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>10</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/3010" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>zcgzcgzcg</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>11</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/311" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>wifiii</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>12</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/3012" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>arknave</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>13</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/3013" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>heyshb</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>14</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/3014" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>Dymonchyk</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box borderBottom={1} className={classes.topScoreItem}>
            <Typography variant="h6" style={{margin: 10}}>15</Typography>
            <Avatar className={classes.small} alt="avatar" src="https://picsum.photos/3015" />
            <Typography color="primary" variant="h6" style={{margin: 10}}>kmjp</Typography>
            <Box className={classes.score}>
              120
              <img  alt="Score" src='/coins_28px.png' />
            </Box>
          </Box>
          <Box className={[classes.topScoreItem, classes.viewMore]}>
            View More...
          </Box>
        </Box>
      </Paper>
    </>
  );
}
