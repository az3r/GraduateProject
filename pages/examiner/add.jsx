import { Box, Container, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import MyAppBar from '../../components/AppBar';
import dynamic from 'next/dynamic';
import Examiner from '../../components/Examiner';
import Layout from '../../components/Layout';

const AddTest = dynamic(
  () => {
    return import('../../components/AddTest');
  },
  { ssr: false }
);

export default function AddTestPage(props) {
  return (
    <>
      <Layout>
        <AddTest></AddTest>
      </Layout>
    </>
  );
}
