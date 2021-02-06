import Head from "next/head";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import Layout from "../components/Layout";
import TestProblem from "../components/TestProblem";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Test() {
    const classes = useStyles();

    return (
        <>
            <Head>
                <title>Smart Coder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <TestProblem></TestProblem>
            </Layout>
        </>
    );
}
