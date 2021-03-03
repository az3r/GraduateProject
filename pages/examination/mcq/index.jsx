import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

const TestMCQ = dynamic(
  () => import('../../../components/TestMCQ'),
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

export default function MCQ({ problem, nextProblem }) {
  // const classes = useStyles();

  return (
    <>
      <Layout>
        <TestMCQ problem={problem} nextProblem={nextProblem} />
      </Layout>
    </>
  );
}
