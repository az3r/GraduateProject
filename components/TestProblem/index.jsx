import { Box, Grid, Typography, Button } from '@material-ui/core';
import React,{useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import Console from './Console';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Problem from './Problem/';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import CodeEditor from './CodeEditor';
import URL from '../URL';
import Router from 'next/router';


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

const codePattern = {
    c_cpp:
      `#include <stdio.h>
int main()
{
    printf("Hello World");
    return 0;
}`,
    csharp:
      `using System;
class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
    java:
      `import java.util.Scanner;
public class Program
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    python:
      `print("Hello world!")`

};

export default function Test({problemId}) {
    const classes = useStyles();


    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('c_cpp');
    const [cases, setCases] = useState('cases');
    const [difficulty, setDifficulty] = useState(1);
    const [score, setScore] = useState(100);
    const [code, setCode] = useState('');
    const [testCodeResult, setTestCodeResult] = useState('');
    const [openConsole, setOpenConsole] = useState('hidden');


    useEffect( () => {
        async function getProblemData() {
            const response = await fetch("/api/get-test", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'examId': problemId})
            });

            const data = await response.json();
            if (response.status === 200) {
                setTitle(data.title);
                setContent(data.content);
                setDifficulty(data.difficulty);
                setScore(data.score);
                setCases(data.cases);
                setLanguage(data.language);
                setCode(codePattern[data.language]);
            } else {
                console.log("Error");
            }
        }

        getProblemData();
    }, []);


    const handleOpenConsoleChange = (e) => {
        if (openConsole == 'visible') {
            setOpenConsole('hidden');
        } else {
            setOpenConsole('visible');
        }
    }

    const handleRunCode = async (e) => {
        setOpenConsole('visible');


        const response = await fetch(URL.GetURL()+"test-exam",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "userId": 1,
                "code": code,
                "language": language,
                "cases": cases,
            })})


        const data = await response.json();
        if(response.status === 200){
            if(data.failed == 0){
                setTestCodeResult("Correct!");
            }
            else{
                setTestCodeResult("Incorrect! \nTest Cases: \n" + JSON.stringify(cases));
            }
        }
        else{
            setTestCodeResult(data.stderr);
        }
    }

    const handleSubmit = async (e) => {
        const response = await fetch(URL.GetURL()+"excute-test", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "userId": 1,
                "examId": problemId,
                "code": code
            })
        })

        if(response.status === 200){
            Router.push('/');
        }
        else{
            console.log("Error");
        }
    }

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    }

    return (
      <Container disableGutters={true} maxWidth={false}>
          <Grid container>
              <Grid item lg={5}>
                  <Problem title={title} content={content} difficulty={difficulty} score={score}></Problem>
              </Grid>
              <Grid item lg={7}>
                  <Paper square>
                      <Box className={classes.headerBox}>
                          Programming Language: {language}
                      </Box>
                      <Box boxShadow={1}>
                          <CodeEditor language={language} code={code}
                                      onCodeChange={handleCodeChange}></CodeEditor>
                      </Box>
                      <Box className={classes.compileBox}>
                          <Box className={classes.consoleBox} component="div" visibility={openConsole}>
                              <Console testCodeResult={testCodeResult}></Console>
                          </Box>
                          <Button size={'small'} onClick={handleOpenConsoleChange} variant="outlined"
                                  className={classes.consoleButton}>Console</Button>
                          <Button size={'small'} type="submit" variant="outlined" onClick={handleSubmit}
                                  className={classes.submitButton}>Submit</Button>
                          <Button size={'small'} type="submit" variant="outlined" onClick={handleRunCode}
                                  className={classes.runCodeButton}>Run Code</Button>
                      </Box>
                  </Paper>
              </Grid>
          </Grid>
      </Container>
    );
}
