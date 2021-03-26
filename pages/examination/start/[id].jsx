import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { comments, exams, submissions, users } from '@libs/client';
import { useRouter  } from 'next/router';
import { parseCookies } from '@libs/client/cookies';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Layout from '../../../components/Layout';

const TestCode = dynamic(
  () => import('../../../components/TestCode'),
  { ssr: false }
);

const TestMCQ = dynamic(
  () => import('../../../components/TestMCQ'),
  { ssr: false }
);


export default function Start({id, problems, user}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState(problems[0]);
  const [results, setResults] = useState([]);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  useEffect(async () => {
    if (user === null) {
      router.replace('/login');
    }
  }, []);

  const nextProblem = async (result, correct) => {
    const resultsTemp = results;
    let numberOfCorrectTemp = numberOfCorrect;
    if (result) {
      resultsTemp.push(result);
      numberOfCorrectTemp += parseInt(correct, 10);

      setResults(resultsTemp);
      // setResults(prevState => [...prevState, result]);
      setNumberOfCorrect(numberOfCorrect + parseInt(correct, 10));
    }

    const indexNext = index + 1;
    setIndex(indexNext);

    if (indexNext < problems.length) {
      setProblem(problems[indexNext]);
    } else {

      console.log(resultsTemp);
      await submissions.createExamSubmission(user.uid, {
        examId: id,
        total: problems.length,
        correct: numberOfCorrectTemp,
        results: resultsTemp,
      });
      // router.push('/examination/end');
      handleCommentClickOpen();
    }
  };


  const handleCommentContentChange = (e) => {
    e.preventDefault();
    setCommentContent(e.target.value);
  }

  const handleCommentClickOpen = () => {
    setCommentOpen(true);
  };

  const handleCommentClose = async () => {
    const usr = await users.get();

    if (usr !== null) {
      await comments.createExamComment(id,
        {
          userId: usr.id,
          username: usr.name,
          avatar: usr.avatar,
          content: "No comment!",
        });
      setCommentOpen(false);
      router.push('/examination/end');
    };
  }

  const handleComment = async () => {
    const usr = await users.get();

    if(usr !== null) {
      await comments.createExamComment(id,
        {
          userId: usr.id,
          username: usr.name,
          avatar: usr.avatar,
          content: commentContent,
        });
      setCommentOpen(false);
      router.push('/examination/end');
    }
  };

  return (
    <>
      <Head>
        <title>Examination</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {problem.isMCQ === true ? (
          <TestMCQ problem={problem} nextProblem={nextProblem} />
        ) : (
          <TestCode user={user} problem={problem} nextProblem={nextProblem} />
        )}
      </Layout>

      {/* Comment */}
      <Dialog open={commentOpen} onClose={handleCommentClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title" style={{color: 'green'}}>
          <EditIcon fontSize="medium"/>
          Your comments!

        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type your comments here...!
          </DialogContentText>
          <TextareaAutosize
            rowsMax={10}
            rowsMin={10}
            style={{width: '100%'}}
            value={commentContent}
            onChange={handleCommentContentChange}
            placeholder="Type your comments here!"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCommentClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleComment} color="primary" variant="outlined">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


export async function getServerSideProps({params, req}) {
  const cookies = parseCookies(req);
  let user = null;
  let items = null;

  try {
    items = await exams.getProblems(params.id);

    if (Object.keys(cookies).length !== 0) {
      if (cookies.user) {
        user = JSON.parse(cookies.user);
      }
    }
  }
  catch (e){
    console.log(e);
  }

  return {
    props: {
      id: params.id,
      problems: items,
      user
    },
  };
}
