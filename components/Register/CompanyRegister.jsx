import * as React from 'react';
import {
  Button,
  Typography,
  Container,
  TextField,
  makeStyles,
  Box,
} from '@material-ui/core';
import Head from 'next/head';
import Link from 'next/link';
export default function CompanyRegister({ onSubmitted }) {
  const styles = useStyles();
  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <Head>
        <title>Register</title>
        <meta property="og-title" content="Register" />
      </Head>
      <Typography variant="h4" align="center">
        Create company account
      </Typography>
      <Container maxWidth="sm" className={styles.form}>
        <TextField
          id="email"
          fullWidth
          name="email"
          type="email"
          className={styles.field}
          label="Buiness Email"
          variant="filled"
          required
        />
        <TextField
          id="username"
          name="username"
          fullWidth
          type="text"
          className={styles.field}
          label="Username"
          variant="filled"
          required
        />
        <TextField
          id="password"
          name="password"
          fullWidth
          type="password"
          className={styles.field}
          label="Password"
          variant="filled"
          required
        />
        <TextField
          id="confirm-password"
          name="confirmPassword"
          fullWidth
          type="password"
          className={styles.field}
          label="Confirm Password"
          variant="filled"
          required
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>

        <Box
          className={styles.seperator}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography align="center">Already have an account?</Typography>
          <Link href="/login">
            <Button
              className={styles.seperator}
              fullWidth
              variant="contained"
              href="/login"
            >
              Login to start now
            </Button>
          </Link>
        </Box>
      </Container>
    </form>
  );
  function onSubmit(e) {
    e.preventDefault();
    onSubmitted(e.target);
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
  },
  form: {
    alignItems: 'center',
  },
  field: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'block',
  },
  seperator: {
    marginTop: theme.spacing(2),
  },
}));
