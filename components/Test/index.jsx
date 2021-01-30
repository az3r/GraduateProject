import { Box, Grid, Typography, Button } from '@material-ui/core';
import React,{useState} from 'react';
import dynamic from 'next/dynamic';
import Console from "../Console";
import makeStyles from "@material-ui/core/styles/makeStyles";

const CodeEditor = dynamic(
    () => {
        return import('../../components/CodeEditor');
    },
    { ssr: false }
);

const useStyles = makeStyles({
    submitButton: {
        color: 'white',
        backgroundColor: 'green',
        top: '50%',
        height: 30,
        float: 'right',
        position: 'relative',
        transform: 'translateY(-50%)',
    },
    runCodeButton: {
        color: 'black',
        backgroundColor: 'white',
        top: '50%',
        height: 30,
        float: 'right',
        position: 'relative',
        transform: 'translateY(-50%)',
    },
    typography: {
        fontWeight: 'bold',
    }
});

export default function Test(props) {
    const classes = useStyles();

    const [testName, setTestName] = useState('Sum 2 integer number');
    const [testIntro, setTestIntro] = useState('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur\n' +
        '                        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam\n' +
        '                        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.');
    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState('');
    const [testFile, setTestFile] = useState('');


    const handleSubmitAddTest = (e) => {
        e.preventDefault();
        console.log(testName);
        console.log(testIntro);
        console.log(language);
        console.log(code);
        console.log(testFile);
    }

    return (
        <Grid container>
            <Grid item lg={5}>
                <Box boxShadow={1} p={2}>
                    <Typography className={classes.typography} variant="1">{testName}</Typography>
                    <Typography variant="body1" gutterBottom>
                        {testIntro}
                    </Typography>
                </Box>
            </Grid>
            <Grid item lg={7}>
                <Box m={1}>
                    <form method="post" onSubmit={handleSubmitAddTest} encType="multipart/form-data">
                        <Box boxShadow={1} p={2} m={3}>
                            <Typography variant={"h5"}>Enter your function: </Typography>
                            <CodeEditor language={language}></CodeEditor>
                        </Box>
                    </form>
                </Box>
                <Box m={1}>
                    <Console/>
                </Box>
                <Box m={1}>
                    <Button type="submit" variant="text" className={classes.submitButton}>Submit</Button>
                    <Button type="submit" variant="text" className={classes.runCodeButton}>Run Code</Button>
                </Box>
            </Grid>
        </Grid>
    );
}