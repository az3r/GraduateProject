import { Container, Typography } from "@material-ui/core";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Typography variant="h1" align="center">
          Home Page
        </Typography>
      </Container>
    </>
  );
}
