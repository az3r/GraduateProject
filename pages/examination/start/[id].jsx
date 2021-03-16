import React, { useState } from 'react';
import Head from 'next/head';
import { exams, submissions } from '@libs/client';
import { useRouter  } from 'next/router';
import { parseCookies } from '@libs/client/cookies';
import TestCode from '../code';
import TestMCQ from '../mcq';

export default function Start({id, problems, user}) {
  console.log(id); // use for saving db
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState(problems[0]);
  const [results, setResults] = useState([]);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);

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

      {problem.isMCQ === true ? (
        <TestMCQ problem={problem} nextProblem={nextProblem} />
      ) : (
        <TestCode
          problem={problem}
          nextProblem={nextProblem}
        />
      )}
    </>
  );
}


export async function getServerSideProps({params, req}) {
  const cookies = parseCookies(req);
  let user = null;

  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      user = JSON.parse(cookies.user);
    }
  }
  const items = await exams.getProblems(params.id);

  return {
    props: {
      id: params.id,
      problems: items,
      user
    },
  };
}
