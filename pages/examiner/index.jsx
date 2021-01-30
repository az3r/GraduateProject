import React from 'react';
import { Container } from "@material-ui/core";
import Head from "next/head";
import MyAppBar from "../../components/AppBar";
import Examiner from "../../components/Examiner";

export default function ExaminerPage(props){
    return(
        <>
        <Head>
            <title>HCMUSCoder - Examiner</title>
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="utf-8" />
        </Head>

        <Container>
            <MyAppBar isExaminer={true}></MyAppBar>
            <Examiner></Examiner>
        </Container>
        </>
    );
}