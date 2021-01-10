import { Container, Typography } from "@material-ui/core";
import Head from "next/head";
import { GuestAppBar } from "../components/app_bars";
export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <GuestAppBar />
        <Typography variant="h1" align="center">
          Home Page
        </Typography>
      </Container>
    </>
  );
}
