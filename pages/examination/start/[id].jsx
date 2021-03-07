import React, { useState } from 'react';
import Head from 'next/head';
import { exams } from '@libs/client';
import { useRouter  } from 'next/router';
import TestCode from '../code';
import TestMCQ from '../mcq';

export default function Start({id, problems}) {
  console.log(id); // use for saving db
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState(problems[0]);

  const nextProblem = () => {
    const indexNext = index + 1;
    setIndex(indexNext);
    console.log(index);
    if(indexNext < problems.length){
      setProblem(problems[indexNext]);
    }
    else{
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


export async function getServerSideProps({params}) {
  const items = await exams.getProblems(params.id);

  return {
    props: {
      id: params.id,
      problems: items,
    },
  };
}
