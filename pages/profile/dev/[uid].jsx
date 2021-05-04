/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { makeStyles, Box, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UserAvatar from '@components/UserProfile/Components/UserAvatar';
import DevProfileTabs from '@components/UserProfile/Developer';
import AppLayout from '@components/Layout';
import ErrorPage from '@components/CustomErrorPage';
import * as devServices from '@libs/client/developers';

const useStyles = makeStyles({
  introBox: {
    backgroundColor: '#960955',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participateBox: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  participateBtn: {
    position: 'absolute',
    top: -50,
  },
  centered: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-100px',
  },
});

const defaultUserProps = [
  'name',
  'avatar',
  'password',
  'email',
  'websites',
  'location',
  'gender',
  'birthday',
  'technicalSkills',
  'experiences',
];

export async function getServerSideProps(context) {
  const { uid } = context.query;
  const user = await devServices.get(uid);

  // check user exists
  if (!user)
    return {
      props: {
        user: null,
      },
    };

  // set default values for undefined field
  defaultUserProps.forEach((prop) => {
    if (user[prop] === undefined) {
      if (
        prop === 'websites' ||
        prop === 'technicalSkills' ||
        prop === 'experiences'
      ) {
        user[prop] = [];
      } else {
        user[prop] = '';
      }
    }
  });

  return {
    props: {
      user,
    },
  };
}

export default function Index(props) {
  const classes = useStyles();

  // flag to avoid change user info
  const isOnlyWatch = true;

  // get user by UID in query
  const apiUser = props.user;

  // check user exist or role is developer
  if (!apiUser || apiUser.role !== 'developer') {
    return <ErrorPage />;
  }

  // introHeight state
  const [introHeight, setIntroHeight] = useState(0);
  useEffect(() => {
    setIntroHeight(window.innerWidth / 5);
  }, []);

  // user info state
  const [user, setUser] = useState(apiUser);

  // snackbar
  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
    severity: 'info',
    message: 'No message',
  });

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Box style={{ height: introHeight }} className={classes.introBox}>
          <UserAvatar
            user={user}
            setUser={setUser}
            setSnackBarState={setSnackBarState}
            isOnlyWatch={isOnlyWatch}
          />
        </Box>
        <Box p={3}>
          <DevProfileTabs
            user={user}
            setUser={setUser}
            setSnackBarState={setSnackBarState}
            isOnlyWatch={isOnlyWatch}
          />
        </Box>
      </AppLayout>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackBarState.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackBarState((prev) => ({
            open: false,
            message: prev.message,
            severity: prev.severity,
          }))
        }
      >
        <Alert variant="filled" severity={snackBarState.severity}>
          {snackBarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}
