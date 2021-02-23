import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import TestCode from '../examination/code';
import TestMCQ from '../examination/mcq';


export default function Start(){
  const [problem, setProblem] = useState("code");

  const nextProblem = () => {
    if(problem === "code"){
      setProblem("mcq");
    }
    else{
      setProblem("code");
    }
  }

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

        {
          problem === "code" ?
          <TestCode problemId={"Ly06j1rBoYqdIfq5iWFJ"} nextProblem={nextProblem}></TestCode> : <TestMCQ problemId={"123"} nextProblem={nextProblem}></TestMCQ>
        }
    </>
  )
}
