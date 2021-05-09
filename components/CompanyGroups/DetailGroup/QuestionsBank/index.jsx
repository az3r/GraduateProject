import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  makeStyles,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HTMLReactParser from 'html-react-parser';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  createdDate: {
    color: 'black',
  },
  typeStyle: {
    margin: '20px',
  },
  linkStyle: {
    color: '#088247',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  titleCol: {
    whiteSpace: 'nowrap',
    width: 550,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const ITEMS_PER_PAGE = 10;
export default function GroupQuestionsBank({ questions }) {
  const classes = useStyles();
  const [searchKey, setSearchKey] = useState('');
  const [type, setType] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [filtedQuestions, setFilterQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const filtered = getDisplayListForPagination(
      questions,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterQuestions(filtered);
    setNumberOfPages(getNumberOfPages(questions));
  }, []);

  const handleChangeType = (e) => {
    setType(e.target.value);
    const newList = getListAfterSearch(questions, searchKey, e.target.value);
    const pages = getNumberOfPages(newList);
    setNumberOfPages(pages);
    const filtered = getDisplayListForPagination(
      questions,
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
      const newList = getListAfterSearch(questions, searchKey, type);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        questions,
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
      questions,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterQuestions(filtered);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          Company groups
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">Questions bank</Typography>
      </Breadcrumbs>
      <Divider />

      <Box m={3} p={2} display="flex" justifyContent="center">
        <OutlinedInput
          className={classes.outlinedInput}
          placeholder="Search..."
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
        />
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
      <Box m={3} display="flex" justifyContent="flex-end">
        <Link href={`/company-groups/${id}/questions-bank/add`}>
          <Button color="secondary" variant="contained">
            Add question
          </Button>
        </Link>
      </Box>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bolder' }}>Questions</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Type</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Language</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Published</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtedQuestions.length > 0 ? (
            filtedQuestions.map((item, index) => (
              <TableRow
                key={item.id}
                className={classes.tableRow}
                hover
                style={
                  index % 2
                    ? { background: 'rgb(250, 250, 250)' }
                    : { background: 'white' }
                }
              >
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.linkStyle}
                >
                  <Link
                    href={`/company-groups/${id}/questions-bank/detail?question=${item.id}`}
                  >
                    {item.isMCQ ? (
                      <div className={classes.titleCol}>
                        {HTMLReactParser(item.title)}
                      </div>
                    ) : (
                      <div className={classes.titleCol}>{item.title}</div>
                    )}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  {item.isMCQ ? (
                    <Typography>Multiple choice</Typography>
                  ) : (
                    <Typography>Coding</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {item.isMCQ ? (
                    <Typography>-</Typography>
                  ) : (
                    <Typography>{item.language}</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {item.isMCQ ? (
                    <Typography>-</Typography>
                  ) : (
                    <Typography>{item.published.toString()}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <Typography>There are no records</Typography>
          )}
        </TableBody>
      </Table>
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
    result = result.filter((item) => item.language !== undefined);
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
    result = result.filter((item) => item.language !== undefined);
  } else if (type === '2') {
    result = result.filter((item) => item.isMCQ === true);
  }
  result = result.slice(
    start * numberOfItemsPerPage,
    (start + 1) * numberOfItemsPerPage
  );
  return result;
}
