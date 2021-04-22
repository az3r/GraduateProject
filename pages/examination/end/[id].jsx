import React, { useState } from 'react';
import Head from 'next/head';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  Button,
} from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
// import { parseCookies } from '@client/cookies';
// import { exams } from '@libs/client';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'white',
    borderColor: 'green',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,
    marginTop: 50,
  },
  feedbackContent: {
    marginRight: 50,
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

export default function Feedback() { // {examId}
  const classes = useStyles();

  const [note, setNote] = useState("none");
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  }

  const handlePostComment = () => {
    if(comment === ""){
      setNote("block");
      
    }

  }


  return (
    <>
      <Head>
        <title>Feedback | Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Container>
          <Box boxShadow={3} border={2} className={classes.root}>
            <Grid container spacing={3}>
              <Hidden smDown>
                <Grid item xs={3}>
                  <Box style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src="/feedback.png" alt="coding icon" />
                  </Box>
                </Grid>
              </Hidden>
              <Grid item xs={12} sm={9}>
                <Box className={classes.feedbackContent}>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <img src="/writing.png" alt="coding icon" />
                    <Typography style={{ marginLeft: 10 }} variant="h4">
                      Please write your feedback to this examination!
                    </Typography>
                  </Box>
                  <Box style={{ fontWeight: 'lighter' }}>
                    <TextareaAutosize onChange={(event) =>  handleCommentChange(event)} style={{width: '100%'}} value={comment} rowsMin={10} rowsMax={10} placeholder="No comments" />
                  </Box>
                  <Box display={note} style={{ fontWeight: 'lighter', color: 'red'}}>
                    *Note: Comment box is empty. Please write your feedback!
                  </Box>
                  <Box className={classes.buttonBox}>
                    <Button style={{margin: 10}} color="secondary" variant="contained" href="/examination/end">
                      Skip
                    </Button>
                    <Button style={{margin: 10}} color="primary" variant="contained" onClick={() => handlePostComment()}>
                      Post
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
    </>
  );
}

export async function getServerSideProps({ params}) {

  return {
    props: {
      examId: params.id,
    },
  };
}
