import React from 'react';
import Head from 'next/head';
import AppLayout from '@components/Layout';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,
    marginTop: 50,
  },
  thankContent: {
    marginLeft: 50,
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 50,
  },
});

export default function Start() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Container>
          <Box border={2} className={classes.root}>
            <img src="/coding.png" alt="coding icon" />
            <Box className={classes.thankContent}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <img src="/check.png" alt="coding icon" />
                <Typography style={{ marginLeft: 10 }} variant="h4">
                  Thank you for taking this test!
                </Typography>
              </Box>
              <Box style={{ fontWeight: 'lighter' }}>
                The recruiter/lecturer will get back to you shortly with the
                results.
              </Box>
              <Box style={{ fontWeight: 'lighter' }}>
                We wish you all the best for the next steps in your application!
              </Box>
            </Box>
          </Box>
          <Box className={classes.buttonBox}>
            <Button size="large" color="primary" variant="contained" href="/">
              Back to Home!
            </Button>
          </Box>
        </Container>
      </AppLayout>
    </>
  );
}
