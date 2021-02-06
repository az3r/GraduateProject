import Head from "next/head";
import { Grid } from "@material-ui/core";


import TopScore from "../components/TopScore";
import Problems from "../components/Problems";
import YourProgress from "../components/YourProgress";
import Layout from "../components/Layout";
import Container from '@material-ui/core/Container';


export default function Home() {

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center">
              {/*<Search />*/}
            </Grid>
            {/*<Grid item xs={12} sm={3}>*/}
            {/*  <TopScore />*/}
            {/*</Grid>*/}
            <Grid item xs={8}>
              <Problems />
            </Grid>
            <Grid item xs={4}>
              <YourProgress />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
