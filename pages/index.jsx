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

export default function Home() {
  const styles = useStyles();
  return (
    <Container>
      <Box display="flex" flexDirection="column" height="100vh">
        <Head>
          <title>Smart Coder</title>
          <meta property="og-title" content="Smart Coder" />
        </Head>

        <GuestAppBar />
        <Paper className={styles.body}>
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
        </Paper>
      </Box>
    </Container>
  );
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
