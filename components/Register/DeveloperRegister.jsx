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
export default function DeveloperRegister({ onSubmitted }) {
  const styles = useStyles();
  return (
    <Box className={styles.root}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Head>
          <title>Register</title>
          <meta property="og-title" content="Register" />
        </Head>
        <Typography variant="h4" align="center" className={styles.title}>
          Create Developer Account
        </Typography>
        <Container maxWidth="sm" className={styles.form}>
          <TextField
            name="email"
            id="email"
            fullWidth
            type="email"
            className={styles.field}
            label="Email"
            variant="filled"
            required
          />
          <TextField
            name="username"
            id="username"
            fullWidth
            type="text"
            className={styles.field}
            label="Username"
            variant="filled"
            required
          />
          <TextField
            name="password"
            id="password"
            fullWidth
            type="password"
            className={styles.field}
            label="Password"
            variant="filled"
            required
          />
          <TextField
            name="confirmPassword"
            id="confirm-password"
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
            <Link href="/login">
              <Button
                className={styles.seperator}
                fullWidth
                variant="contained"
                href="/login"
              >
                I already had an account
              </Button>
            </Link>
          </Box>
        </Container>
      </form>
    </Box>
  );
  function onSubmit(e) {
    e.preventDefault();
    onSubmitted(e.target);
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  form: {},
  field: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'block',
  },
  seperator: {
    marginTop: theme.spacing(1),
  },
}));
