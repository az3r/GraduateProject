import React from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Container,
  Button,
  Typography,
  Grid,
  Box,
  Hidden,
} from '@material-ui/core';
import Link from 'next/link';
import { users } from '@libs/client';
import { parseCookies } from '@client/cookies';

const useStyles = makeStyles({
  logo: {
    display: 'flex',
    marginTop: 20,
    alignItems: 'center',
  },
  authen: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg">
        <Grid container direction="row" spacing={5}>
          <Grid item xs={12} md={6}>
            <Box className={classes.logo}>
              <img src="/logo.png" alt="Logo" />
              <Typography variant="h3" style={{ fontWeight: 'bolder' }}>
                Smart Code
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.authen}>
              <Link href="/login">
                <Button
                  style={{ marginRight: 15 }}
                  variant="outlined"
                  color="primary"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  style={{ marginRight: 15 }}
                  variant="outlined"
                  color="secondary"
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" style={{ color: 'gray' }}>
                "Make it work, make it right, make it fast"
              </Typography>
              <Typography variant="subtitle1" style={{ color: 'gray' }}>
                ~~ Kent Beck ~~
              </Typography>
            </Box>
            <br />
            <br />
            <Grid container direction="row" spacing={5}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4">For Companies</Typography>
                <br />
                <Typography variant="subtitle1" style={{ color: 'gray' }}>
                  Providing the complex and good problems is a urgent mission of
                  leading companies.
                </Typography>
                <br />
                <Link href="/register/company">
                  <Button variant="contained" color="primary">
                    Sign Up & Create
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4">For Developers</Typography>
                <br />
                <Typography variant="subtitle1" style={{ color: 'gray' }}>
                  Experience is a crucial thing for our own developers. So don't
                  hesitate... Let's do it right now!
                </Typography>
                <br />
                <Link href="/register">
                  <Button variant="contained" color="primary">
                    Sign Up & Code
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid item xs={12} md={6}>
              <img src="/home.png" alt="Logo" />
            </Grid>
          </Hidden>
          <Grid item xs={12}>
            <Typography variant="subtitle1" style={{ color: 'gray' }}>
              Copyright@ 2021 Smart Code |
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  let user = null;

  try {
    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);

        if (user) {
          user = await users.find(user.uid);

          if (user.role === 'developer') {
            return {
              redirect: {
                permanent: false,
                destination: '/problem',
              },
            };
          }
          if (user.role === 'company') {
            return {
              redirect: {
                permanent: false,
                destination: '/company-groups',
              },
            };
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {},
  };
}
