/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { makeStyles, Box, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useAuth } from '@hooks/auth';
import UserAvatar from '@components/UserProfile/Components/UserAvatar';
import CompanyProfileTabs from '@components/UserProfile/Company';
import AppLayout from '@components/Layout';
import * as companyServices from '@libs/client/companies';

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
});

const initialUser = {
  name: '',
  avatar: '',
  password: '',
  email: '',
  introduction: '',
  website: '',
  industry: '',
  headquarter: '',
  specialties: [],
};

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

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);

  if (Object.keys(cookies).length !== 0 && cookies.user) {
    return {
      props: {
        user: JSON.parse(cookies.user),
      },
    };
  }
  return {
    props: {
      user: '',
    },
  };
}

export default function Index(props) {
  const classes = useStyles();
  const router = useRouter();

  // user get from useAuth()
  const auth = useAuth();

  // introHeight state
  const [introHeight, setIntroHeight] = useState(0);
  useEffect(() => {
    setIntroHeight(window.innerWidth / 5);
  }, []);

  // check user login by checking user info in cookie
  useEffect(() => {
    if (Object.keys(props.user).length === 0) {
      router.replace('/login');
    }
  });
  if (!props.user) {
    return null;
  }

  // user info state
  const [user, setUser] = useState(initialUser);

  // get user from api
  let apiUser = null;
  useEffect(async () => {
    if (auth) {
      // get info
      apiUser = await companyServices.get(props.user.uid);

      // check loginUser access to wrong profile link
      // role is company, but access dev profile link
      if (!apiUser && props.user) {
        router.replace('/profile/dev');
        return;
      }

      // set default values for undefined field
      defaultUserProps.forEach((prop) => {
        if (apiUser[prop] === undefined) {
          if (prop === 'specialties') {
            apiUser[prop] = [];
          } else {
            apiUser[prop] = '';
          }
        }
      });

      setUser(apiUser);
    }
  }, [auth]);

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
          />
        </Box>
        <Box p={3}>
          <CompanyProfileTabs
            user={user}
            setUser={setUser}
            setSnackBarState={setSnackBarState}
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
