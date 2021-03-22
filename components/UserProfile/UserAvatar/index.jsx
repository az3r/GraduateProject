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
  // const user = useAuth();
  const { user } = props;

  if (!user) return null;

  return (
    <Box style={{ textAlign: 'center', padding: '10px' }}>
      <img
        className={classes.avatar}
        src={user.photoURL}
        alt="user's profile"
      />
      <Typography variant="h4" className={classes.introTitle}>
        {user.displayName}
      </Typography>
    </Box>
  );
}
