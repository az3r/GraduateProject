import { Box, Button, Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function Examiner(props) {
  const router = useRouter();

  const goToAddProblemPage = (e) => {
    e.preventDefault();
    router.push('examiner/add-problem');
  };

  const goToAddExamPage = (e) => {
    e.preventDefault();
    router.push('examiner/add-exam');
  };

  return (
    <>
      <Grid container>
        <Grid item lg={3}>
          <Box boxShadow={3}>
            <div>
              <Button>My tests</Button>
            </div>
            <div>
              <Button onClick={goToAddExamPage}>Add exam</Button>
            </div>
            <div>
              <Button onClick={goToAddProblemPage}>Add problem</Button>
            </div>
          </Box>
        </Grid>
        <Grid item lg={9}>
          <Box boxShadow={3}></Box>
        </Grid>
      </Grid>
    </>
  );
}
