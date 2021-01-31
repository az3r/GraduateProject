import React from 'react';
import { Container } from "@material-ui/core";
import Head from "next/head";
import MyAppBar from "../../components/AppBar";
import Examiner from "../../components/Examiner";
import Layout from "../../components/Layout";

export default function ExaminerPage(props){
    return(
      <>
          <Head>
              <title>HCMUSCoder - Examiner</title>
              <link rel="icon" href="/favicon.ico" />
          </Head>

          <Layout>
              <Examiner></Examiner>
          </Layout>
      </>
    );
}