import { Box, Container, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import MyAppBar from '../../components/AppBar';
import dynamic from 'next/dynamic';
import Examiner from '../../components/Examiner';
import Layout from '../../components/Layout';

const AddCodeProblem = dynamic(
  () => import('../../components/Examiner/AddCodeProblem'),
  { ssr: false });

export default function AddProblem(props) {
  return (
    <>
      <Layout>
        <AddCodeProblem></AddCodeProblem>
      </Layout>
    </>
  );
}
