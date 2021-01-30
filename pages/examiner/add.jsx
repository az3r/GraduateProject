import { Container, Typography } from '@material-ui/core';
import { Editor, EditorState } from 'draft-js';
import React,{useState} from 'react';
import MyAppBar from '../../components/AppBar';
import dynamic from "next/dynamic";

const CodeEditor = dynamic(
    () => {
      return import('../../components/CodeEditor');
    },
    { ssr: false }
  );
export default function AddTest(props){

    return(
        <>
            <Container>
                <MyAppBar isExaminer = {true}></MyAppBar>
                <form>
                    <Typography>Enter test name: </Typography>
                    <Typography>Enter test information: </Typography>
                    <Typography>Enter test cases: </Typography>
                    <input type="file"></input>
                    <Typography>Enter initial function: </Typography>
                    <CodeEditor></CodeEditor>
                </form>           
            </Container>
        </>
    );
}