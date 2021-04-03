/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { makeStyles, Box } from '@material-ui/core';
import { useAuth } from '@hooks/auth';
import * as userServices from '@libs/client/users';
import UserAvatar from '@components/UserProfile/UserAvatar';
import UserProfileTabs from '@components/UserProfile';
import AppLayout from '../../components/Layout';

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
  websites: [],
  location: '',
  gender: '',
  birthday: '',
  technicalSkills: [],
  experiences: [],
};

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
  const handleUserInfoChange = (prop, newValue) =>
    setUser({ ...user, [prop]: newValue });

  // get user from api
  let apiUser = null;
  useEffect(async () => {
    if (auth) {
      // get info
      apiUser = await userServices.get();

      // set default values for undefined field
      defaultUserProps.forEach((prop) => {
        if (apiUser[prop] === undefined) {
          if (
            prop === 'websites' ||
            prop === 'technicalSkills' ||
            prop === 'experiences'
          ) {
            apiUser[prop] = [];
          } else {
            apiUser[prop] = '';
          }
        }
      });
      setUser(apiUser);
    }
  }, [auth]);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Box style={{ height: introHeight }} className={classes.introBox}>
          <UserAvatar user={user} handleUserInfoChange={handleUserInfoChange} />
        </Box>
        <Box p={3}>
          <UserProfileTabs
            user={user}
            setUser={setUser}
            handleUserInfoChange={handleUserInfoChange}
          />
        </Box>
      </AppLayout>
    </>
  );
}
