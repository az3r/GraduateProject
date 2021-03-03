import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

const TestCode = dynamic(
  () => import('../../../components/TestCode'),
  { ssr: false }
);

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

export default function Code({ problem, nextProblem }) {

  return (
    <>
      <Layout>
        <TestCode problem={problem} nextProblem={nextProblem} />
      </Layout>
    </>
  );
}
