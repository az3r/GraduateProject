/* eslint-disable react/react-in-jsx-scope */
import { makeStyles, Box, Link } from '@material-ui/core';
import Head from 'next/head';

const useStyles = makeStyles({
  centered: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-100px',
  },
});

export default function Index() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>404: This page could not be found</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={classes.centered}>
        <h1>404 - This page could not be found</h1>
        <Link href="/">
          <a>Go back home</a>
        </Link>
      </Box>
    </>
  );
}
