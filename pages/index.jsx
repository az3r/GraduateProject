import Head from "next/head";
import { Grid } from "@material-ui/core";


import TopScore from "../components/TopScore";
import ProblemsTable from "../components/ProblemsTable";
import Search from "../components/Search";
import Layout from "../components/Layout";


export default function Home() {

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <Layout>
        <Grid container spacing={3}>
          <Grid item xs={12}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center">
            <Search />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TopScore />
          </Grid>
          <Grid item xs={12} sm={9}>
            <ProblemsTable />
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}
