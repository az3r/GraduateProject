import {
  Container,
  Paper,
  Typography,
  Box,
  makeStyles,
  Button,
} from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import { GuestAppBar } from "../components/app_bars";
import { useAuth, logout } from "../hooks/auth";

export default function Home() {
  const styles = useStyles();
  const user = useAuth();
  return (
    <Container>
      <Box display="flex" flexDirection="column" height="100vh">
        <Head>
          <title>Smart Coder</title>
          <meta property="og-title" content="Smart Coder" />
        </Head>
        <GuestAppBar />
        <Paper className={styles.body}>
          {user ? UserSignedIn() : UserSignedOut()}
        </Paper>
      </Box>
    </Container>
  );
  function UserSignedOut() {
    return (
      <>
        <Typography variant="h4">You are not signed in</Typography>
        <Link href="/login">
          <Button
            className={styles.spacing}
            variant="contained"
            color="primary"
            href="/login"
          >
            Login Now
          </Button>
        </Link>
      </>
    );
  }
  function UserSignedIn() {
    return (
      <>
        <Typography variant="h4">You are signed in</Typography>
        <Typography variant="h6">ID: {user.uid}</Typography>
        <Typography variant="h6">Display Name: {user.displayName}</Typography>
        <Button variant="contained" color="primary" onClick={logout}>
          Sign out
        </Button>
      </>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    margin: theme.spacing(2),
  },
}));
