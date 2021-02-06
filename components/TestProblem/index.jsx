import { Box, Grid, Typography, Button } from '@material-ui/core';
import React,{useState} from 'react';
import dynamic from 'next/dynamic';
import Console from './Console';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Problem from './Problem/';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const CodeEditor = dynamic(
    () => {
        return import('./CodeEditor');
    },
    { ssr: false }
);

const useStyles = makeStyles( {
    consoleButton: {
        color: 'black',
        backgroundColor: 'white',
        float: 'left',
        marginLeft: 10,
    },
    submitButton: {
        color: 'white',
        backgroundColor: 'green',
        float: 'right',
        marginRight: 10,
    },
    runCodeButton: {
        color: 'black',
        backgroundColor: 'white',
        float: 'right',
        marginRight: 5,
    },
    headerBox: {
        height: 40,
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
    },
    compileBox: {
        marginTop: 10,
        height: 50,
        position: 'relative',
    },
    consoleBox: {
        height: 200,
        position: 'absolute',
        top: -200,
        zIndex: 4,
    }
});

export default function Test({props}) {
    const classes = useStyles();

    const [testName, setTestName] = useState('Sum 2 integer number');
    const [testIntro, setTestIntro] = useState('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur\n' +
      '                        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam\n' +
      '                        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.');
    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState('');
    const [testFile, setTestFile] = useState('');
    const [openConsole, setOpenConsole] = useState('hidden');


    const handleSubmitAddTest = (e) => {
        e.preventDefault();
        console.log(testName);
        console.log(testIntro);
        console.log(language);
        console.log(code);
        console.log(testFile);
    }

    const handleOpenConsoleChange = (e) => {
        if(openConsole == 'visible'){
            setOpenConsole('hidden');
        }
        else{
            setOpenConsole('visible');
        }
    }

    return (
      <Container disableGutters={true} maxWidth={false}>
          <Grid container>
              <Grid item lg={5}>
                  <Problem></Problem>
              </Grid>
              <Grid item lg={7}>
                  <Paper square>
                      <Box className={classes.headerBox}>
                          Programming Language: {language}
                      </Box>
                      <Box boxShadow={1}>
                          <CodeEditor language={language}></CodeEditor>
                      </Box>
                      <Box className={classes.compileBox}>
                          <Box className={classes.consoleBox} component="div" visibility={openConsole}>
                              <Console></Console>
                          </Box>
                          <Button size={'small'} onClick={handleOpenConsoleChange}  variant="outlined" className={classes.consoleButton}>Console</Button>
                          <Button size={'small'} type="submit" variant="outlined" className={classes.submitButton}>Submit</Button>
                          <Button size={'small'} type="submit" variant="outlined" className={classes.runCodeButton}>Run Code</Button>
                      </Box>
                  </Paper>

                  {/*<Box boxShadow={1} p={3}>*/}
                  {/*      <CodeEditor language={language}></CodeEditor>*/}
                  {/*</Box>*/}
                  {/*<Box m={1}>*/}
                  {/*    <Console />*/}
                  {/*</Box>*/}
                  {/*<Box m={1}>*/}
                  {/*    <Button type="submit" variant="text" className={classes.submitButton}>Submit</Button>*/}
                  {/*    <Button type="submit" variant="text" className={classes.runCodeButton}>Run Code</Button>*/}
                  {/*</Box>*/}
              </Grid>
          </Grid>
      </Container>
    );
}
