import * as React from "react";
import {
  Button,
  Typography,
  Container,
  TextField,
  makeStyles,
  Link as MaterialLink,
  Box,
  CircularProgress,
} from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
export default function Register() {
  const styles = useStyles();
  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <Head>
        <title>Register</title>
        <meta property="og-title" content="Register" />
      </Head>
      <Typography variant="h4" align="center">
        Register a new account
      </Typography>
      <Container maxWidth="sm" className={styles.form}>
        <TextField
          id="email"
          fullWidth
          type="email"
          className={styles.field}
          label="Email"
          variant="filled"
          required
        />
        <TextField
          id="username"
          fullWidth
          type="text"
          className={styles.field}
          label="Username"
          variant="filled"
          required
        />
        <TextField
          id="password"
          fullWidth
          type="password"
          className={styles.field}
          label="Password"
          variant="filled"
          required
        />
        <TextField
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

  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
  },
  form: {
    alignItems: "center",
  },
  field: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: "block",
  },
  seperator: {
    marginTop: theme.spacing(2),
  },
}));
