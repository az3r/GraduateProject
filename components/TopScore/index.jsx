import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export default function TopScore() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" align="center">
        TOP SCORE
      </Typography>
      <Divider />
      <Paper variant="outlined" className={classes.paper}>
        1. Nguyễn Thanh Tùng
      </Paper>
      <Paper variant="outlined" className={classes.paper}>
        2. Thái Thanh Tùng
      </Paper>
      <Paper variant="outlined" className={classes.paper}>
        3. Âu Dương Gia Tuấn
      </Paper>
      <Paper variant="outlined" className={classes.paper}>
        4. La Mạnh Tuấn
      </Paper>
      <Paper variant="outlined" className={classes.paper}>
        5. Nguyễn Mạnh Tuấn
      </Paper>
    </>
  );
}
