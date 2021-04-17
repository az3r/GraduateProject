/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  makeStyles,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  introTitle: {
    color: 'white',
    marginTop: 5,
  },
  avatar: {
    // cursor: 'pointer',
    height: 140,
    width: 140,
    border: '5px solid white',
    borderRadius: 15,
  },
});

export default function UserAvatar(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState, isOnlyWatch } = props;

  const handleChangeAvatar = (event) => {
    const image = event.target.files[0];
    console.log(image);
  };

  const handleEditAvatar = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  return (
    <Box style={{ textAlign: 'center', padding: '10px' }}>
      <img className={classes.avatar} src={user.avatar} alt="user's profile" />
      <div>
        <input
          type="file"
          id="imageInput"
          hidden="hidden"
          onChange={handleChangeAvatar}
        />

        {/* is in only watch mode */}
        {isOnlyWatch ? null : (
          <Tooltip title="Edit avatar" placement="right">
            <IconButton style={{ color: 'white' }} onClick={handleEditAvatar}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Typography variant="h4" className={classes.introTitle}>
        {user.name}
      </Typography>
    </Box>
  );
}
