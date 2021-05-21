import React from 'react';
import Head from 'next/head';
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
  forbiddenContent: {
    marginLeft: 50,
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 50,
  },
});

export default function DeletedForbidden() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Forbidden | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Box border={2} className={classes.root}>
          <img src="/coding.png" alt="coding icon" />
          <Box className={classes.forbiddenContent}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Typography style={{ marginLeft: 10 }} variant="h4">
                This problem deleted!
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.buttonBox}>
          <Button size="large" color="primary" variant="contained" href="/">
            Back to Home!
          </Button>
        </Box>
      </Container>
    </>
  );
}
