import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  OutlinedInput,
  Select,
  Typography,
} from '@material-ui/core';
import { getProblems } from '@libs/client/companies';
import HTMLReactParser from 'html-react-parser';
import { Pagination } from '@material-ui/lab';
import { get } from '@libs/client/problems';

const useStyles = makeStyles({
  container: {
    width: 500,
  },
  listItem: {
    width: '100%',
  },
  titleStyle: {
    wordWrap: 'break-word',
  },
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  typeStyle: {
    margin: '20px',
  },
});

const ITEMS_PER_PAGE = 10;

export default function AddProblemFromLibrary({
  idCompany,
  questionsList,
  handleAddQuestionFromLibrary,
}) {
  const [problemsList, setProblemsList] = useState([]);
  const [filterQuestions, setFilterQuestions] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(async () => {
    const problemsData = await getProblems(idCompany);
    setProblemsList(problemsData);
    const filtered = getDisplayListForPagination(
      problemsList,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterQuestions(filtered);
    setNumberOfPages(getNumberOfPages(problemsList));
  }, [problemsList]);

  const classes = useStyles();
  const [type, setType] = useState(0);

  const handleChangeType = (e) => {
    setType(e.target.value);
    const newList = getListAfterSearch(problemsList, searchKey, e.target.value);
    const pages = getNumberOfPages(newList);
    setNumberOfPages(pages);
    const filtered = getDisplayListForPagination(
      problemsList,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      e.target.value
    );
    setFilterQuestions(filtered);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(problemsList, searchKey, type);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        problemsList,
        0,
        ITEMS_PER_PAGE,
        searchKey,
        type
      );
      setFilterQuestions(filtered);
      setPage(1);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      problemsList,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterQuestions(filtered);
  };

  return (
    <Box m={3} p={2} className={clsx(classes.container)}>
      <Typography variant="h5">Choose questions from library</Typography>
      <Box display="flex" justifyContent="center">
        <OutlinedInput
          className={classes.outlinedInput}
          placeholder="Search..."
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Select
          native
          value={type}
          onChange={handleChangeType}
          className={classes.typeStyle}
        >
          <option value={0}>All</option>
          <option value={1}>Coding questions</option>
          <option value={2}>Multiple choice questions</option>
        </Select>
      </Box>
      <List>
        {filterQuestions?.map((item) => (
          <ListItem key={item.id}>
            <ListItemIcon>
              {questionsList.find((question) => question.id === item.id) ? (
                <IconButton variant="contained" color="primary" disabled>
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={async () =>
                    handleAddQuestionFromLibrary(await get({problemId: item.id}))
                  }
                >
                  <AddIcon />
                </IconButton>
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  {item.isMCQ ? (
                    <>
                      <div className={classes.titleStyle}>
                        {HTMLReactParser(item.title)}
                      </div>
                      <Typography>Multiple choice question</Typography>
                    </>
                  ) : (
                    <>
                      <Typography className={classes.titleStyle}>
                        {item.title}
                      </Typography>
                      <Typography>Coding question</Typography>
                    </>
                  )}
                </>
              }
              secondary={
                <>
                  <Link
                    href={`/company-groups/${idCompany}/questions-bank/detail?question=${item.id}`}
                    target="_blank"
                  >
                    Go to detail question
                  </Link>
                  <Divider />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" justifyContent="center" p={2}>
        <Pagination
          count={numberOfPages}
          page={page}
          color="primary"
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
}

function getNumberOfPages(list) {
  return list.length % ITEMS_PER_PAGE === 0
    ? Math.floor(list.length / ITEMS_PER_PAGE)
    : Math.floor(list.length / ITEMS_PER_PAGE) + 1;
}

function getListAfterSearch(list, filterName, type) {
  let result = list.filter((item) =>
    item.title.toLowerCase().includes(filterName.toLowerCase())
  );
  if (type === '1') {
    result = result.filter((item) => item.isMCQ === undefined);
  } else if (type === '2') {
    result = result.filter((item) => item.isMCQ === true);
  }
  return result;
}

function getDisplayListForPagination(
  list,
  start,
  numberOfItemsPerPage,
  filterName,
  type
) {
  let result = list.filter((item) =>
    item.title.toLowerCase().includes(filterName.toLowerCase())
  );
  if (type === '1') {
    result = result.filter((item) => item.isMCQ === undefined);
  } else if (type === '2') {
    result = result.filter((item) => item.isMCQ === true);
  }
  result = result.slice(
    start * numberOfItemsPerPage,
    (start + 1) * numberOfItemsPerPage
  );
  return result;
}
