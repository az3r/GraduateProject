/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
// import { useAuth } from '@hooks/auth';

const useStyles = makeStyles({
  introTitle: {
    color: 'white',
    marginTop: 5,
  },
  avatar: {
    cursor: 'pointer',
    height: 140,
    width: 140,
    border: '5px solid white',
    borderRadius: 15,
  },
});

export default function UserAvatar(props) {
  const classes = useStyles();
  const { user } = props;

  return (
    <Box style={{ textAlign: 'center', padding: '10px' }}>
      <img className={classes.avatar} src={user.avatar} alt="user's profile" />
      <Typography variant="h4" className={classes.introTitle}>
        {user.name}
      </Typography>
    </Box>
  );
}
