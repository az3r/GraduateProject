import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import Search from './Search/index';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  link: {
    color: 'green',
  },
  box: {
    color: 'white',
  },
  tableRow: {
    hover: { color: '#7EA5FF' },
  },
  pagination: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const PROBLEM_PER_PAGE = 2;
let problemList = [];
let filteredProblemList = [];

export default function Problems() {
  const classes = useStyles();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [language, setLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);


  useEffect(() => {
    async function getProblems() {
      const response = await fetch('/api/get-all-test', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setProblems(data);
        //
        problemList = data;
        setTotalPage(Math.ceil(data.length / PROBLEM_PER_PAGE));
        setProblems(data.slice((currentPage - 1) * PROBLEM_PER_PAGE, currentPage * PROBLEM_PER_PAGE));
      } else {
        setProblems([]);
      }
    }

    getProblems();
  }, []);

  const filter = (search, difficulty, language, page) => {
    if(search === ''){
      filteredProblemList = problemList;
    }
    else{
      filteredProblemList = problemList.filter(problem => problem.data.title.toLowerCase().includes(search.toLowerCase()));
    }

    if(difficulty !== 'all'){
      if(difficulty === 'easy'){
        filteredProblemList = filteredProblemList.filter(problem => problem.data.difficulty === 0);
      }
      else if(difficulty === 'medium'){
        filteredProblemList = filteredProblemList.filter(problem => problem.data.difficulty === 1);
      }
      else{
        filteredProblemList = filteredProblemList.filter(problem => problem.data.difficulty === 2);
      }
    }

    if(language !== 'all'){
      filteredProblemList = filteredProblemList.filter(problem => problem.data.language.toLowerCase() === language);
    }

    //
    setTotalPage(Math.ceil(filteredProblemList.length / PROBLEM_PER_PAGE))

    if(filteredProblemList){
      setProblems(filteredProblemList.slice((page - 1) * PROBLEM_PER_PAGE, page * PROBLEM_PER_PAGE));
    }
    else{
      setProblems([]);
    }
  }

  const handleSearchKeyPress = (e) => {
    if(e.key === 'Enter'){
      setCurrentPage(1);
      filter(search, difficulty, language, 1);
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setCurrentPage(1);
    filter(search, e.target.value, language, 1);
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCurrentPage(1);
    filter(search, difficulty, e.target.value, 1);
  }

  const handlePagination = (e, page) => {
    setCurrentPage(page);
    filter(search, difficulty, language, page);
  }

  return (
    <TableContainer component={Paper}>
      <Search search={search} handleSearchChange={handleSearchChange} handleSearchKeyPress={handleSearchKeyPress}
              difficulty={difficulty} handleDifficultyChange={handleDifficultyChange}
              language={language} handleLanguageChange={handleLanguageChange}/>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems.map((problem, index) => (
            <TableRow
              key={problems.id}
              className={classes.tableRow}
              hover
              style={
                index % 2
                  ? { background: 'rgb(250, 250, 250)' }
                  : { background: 'white' }
              }
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                <Link
                  href={`/problem/${problem.id}`}
                  underline={'none'}
                  className={classes.link}
                >
                  {problem.data.title}
                </Link>
              </TableCell>
              <TableCell>
                <Box
                  component="span"
                  display="inline"
                  p={'4px'}
                  borderRadius={16}
                  className={classes.box}
                  pl={1}
                  pr={1}
                  bgcolor={
                    problem.data.difficulty == 0
                      ? 'green'
                      : problem.data.difficulty == 1
                      ? 'orange'
                      : 'red'
                  }
                >
                  {problem.data.difficulty == 0
                    ? 'Easy'
                    : problem.data.difficulty == 1
                    ? 'Medium'
                    : 'Hard'}
                </Box>
              </TableCell>
              <TableCell>{problem.data.language}</TableCell>
              <TableCell>{problem.data.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.pagination}>
        <Pagination onChange={handlePagination} count={totalPage} page={currentPage} variant="outlined" color="primary" />
      </div>
    </TableContainer>
  );
}
