import Head from "next/head";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import Layout from "../../components/Layout";
import TestProblem from "../../components/TestProblem";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Test({problemData}) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Smart Coder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <TestProblem></TestProblem>
      </Layout>
    </>
  );
}

function createData(id, problem, difficulty, domain, score) {
  return { id, problem, difficulty, domain, score };
}

const rows = [
  createData('1', 'Sum 2 interger number', 'Easy', 'C#', 67),
  createData('2', 'Sum 2 float number', 'Easy', 'C/C++', 51),
  createData('3', 'Birthday party', 'Medium', 'Java', 24),
  createData('4', 'Way to my house', 'Easy', "C#", 24),
  createData('5','Car or plane', 'Easy', 'Java', 49),
  createData('6','Find my password', 'Hard', 'Java', 87),
  createData('7','30 second', 'Hard', "C#", 37),
  createData('8','How many apple', 'Hard', "C/C++", 94),
  createData('9','The left mouse', 'Easy', 'Javascript', 65),
  createData('10','Red button', 'Medium', 'Java', 98),
  createData('11','Sum 2 interger number', 'Easy', 'C#', 67),
  createData('12','Sum 2 float number', 'Easy', 'C/C++', 51),
  createData('13','Birthday party', 'Medium', 'Java', 24),
  createData('14','Way to my house', 'Easy', "C#", 24),
  createData('15','Car or plane', 'Easy', 'Java', 49),
  createData('16','Find my password', 'Hard', 'Java', 87),
  createData('17','30 second', 'Hard', "C#", 37),
  createData('18','How many apple', 'Hard', "C/C++", 94),
  createData('19','The left mouse', 'Easy', 'Javascript', 65),
  createData('20','Red button', 'Medium', 'Java', 98),
];

export async function getStatisPaths() {
  return rows.map(row => {
    return {
      params: {
        id: row.id
      }
    }
  })
}

export async function getStatisProps({params}) {
  return {
    props: {
      problemDate: ''
    }
  }
}
