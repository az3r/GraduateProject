import { Box, Container, Typography } from '@material-ui/core';
import React,{useState} from 'react';
import MyAppBar from '../../components/AppBar';
import dynamic from 'next/dynamic';

const AddTest = dynamic(
    () => {
      return import('../../components/AddTest');
    },
    { ssr: false }
  );


export default function AddTestPage(props){
    return(
        <>
            <MyAppBar isExaminer = {true}></MyAppBar>
            <Container>
                <AddTest></AddTest>
            </Container>
        </>
    );
}