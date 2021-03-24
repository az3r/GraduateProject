import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { exams, submissions } from '@libs/client';
import { useRouter  } from 'next/router';
import { parseCookies } from '@libs/client/cookies';
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
  console.log(id); // use for saving db
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState(problems[0]);
  const [results, setResults] = useState([]);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);

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

      await submissions.createExamSubmission(user.uid, {
        examId: id,
        total: problems.length,
        correct: numberOfCorrectTemp,
        results: resultsTemp,
      });
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
