import { Container, Typography } from "@material-ui/core";
import Head from "next/head";
import MyAppBar from "../components/AppBar";
export default function HomePage() {
  return (
    <>
      <Head>
        <title>HCMUSCoder - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
         <MyAppBar isExaminer={true}></MyAppBar>
         
      </Container>
    </>
  );
}
