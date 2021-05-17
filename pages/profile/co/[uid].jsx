/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { makeStyles, Box, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UserAvatar from '@components/UserProfile/Components/UserAvatar';
import CompanyProfileTabs from '@components/UserProfile/Company';
import AppLayout from '@components/Layout';
import ErrorPage from '@components/CustomErrorPage';
import * as companyServices from '@libs/client/companies';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';

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
  'introduction',
  'website',
  'industry',
  'headquarter',
  'specialties',
];

export async function getServerSideProps(context) {
  const { uid } = context.query;
  const user = await companyServices.get(uid);

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
      if (prop === 'specialties') {
        user[prop] = [];
      } else {
        user[prop] = '';
      }
    }
  });

  // check user in cookie is the same user in query
  const cookies = parseCookies(context.req);
  const cookiesStr = JSON.stringify(cookies);
  let isTheSameUser = false;

  if (Object.keys(cookies).length !== 0 && cookies.user) {
    if(cookiesStr.includes(uid)){
      isTheSameUser = true;
    }
  }

  return {
    props: {
      user,
      isTheSameUser,
    },
  };
}

export default function Index(props) {
  const classes = useStyles();
  const router = useRouter();

  // flag to avoid change user info
  const isOnlyWatch = true;

  // get user by UID in query
  const apiUser = props.user;

  // check user exist or role is company
  if (!apiUser || apiUser.role !== 'company') {
    return <ErrorPage />;
  }

  // check user in cookie is the same user in query
  useEffect(() => {
    if (props.isTheSameUser) {
      router.replace('/profile/co');
    }
  });

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
          <CompanyProfileTabs
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
