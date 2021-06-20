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
import { useAuth } from '@hooks/auth';
import * as userServices from '@libs/client/users';

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

  // user get from useAuth()
  const { user: auth } = useAuth();

  const handleChangeAvatar = async (event) => {
    const image = event.target.files[0];
    const { type } = image;
    const isImageType = type.includes('image/');

    // is not image
    if (!isImageType) {
      setSnackBarState({
        open: true,
        severity: 'error',
        message: 'Cannot upload your avatar',
      });
      return;
    }

    // is image
    try {
      const url = await userServices.updateAvatar(auth, user.role, image);
      setUser({ ...user, avatar: url });

      setSnackBarState({
        open: true,
        severity: 'success',
        message: 'Update successfully!',
      });
    } catch (err) {
      console.log(err);
      setSnackBarState({
        open: true,
        severity: 'error',
        message: 'Internal server error',
      });
    }
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
          accept="image/*"
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
