import {
  Box,
  Breadcrumbs,
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
  Link as MLink,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import dateFormat from 'dateformat';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },

  typeStyle: {
    margin: '20px',
  },
  linkStyle: {
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
export default function DetailMember({ questions, exams }) {
  const [listToShow, setListToShow] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [type, setType] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setNumberOfPages(getNumberOfPages(questions));
    const temp = getDisplayListForPagination(
      questions,
      exams,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setListToShow(temp);
  }, []);

  const handleChangeType = (e) => {
    setType(Number(e.target.value));
    const list = getListAfterSearch(
      questions,
      exams,
      searchKey,
      Number(e.target.value)
    );
    const pages = getNumberOfPages(list);
    setNumberOfPages(pages);
    const filtered = getDisplayListForPagination(
      questions,
      exams,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      Number(e.target.value)
    );
    setListToShow(filtered);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(questions, exams, searchKey, type);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        questions,
        exams,
        0,
        ITEMS_PER_PAGE,
        searchKey,
        type
      );
      setListToShow(filtered);
      setPage(1);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      questions,
      exams,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setListToShow(filtered);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/members`}>
          <Typography className={classes.linkStyle}>Group members</Typography>
        </Link>
        <Typography color="textPrimary">Member</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
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
          <option value={0}>Questions</option>
          <option value={1}>Examinations</option>
        </Select>
      </Box>
      <Box m={3}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bolder' }}>Title</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>
                Created date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listToShow.map((item, index) => (
              <TableRow
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
                  <MLink
                    target="_blank"
                    href={
                      type === 0
                        ? `/company-groups/${id}/questions-bank/detail?question=${item.id}`
                        : `/company-groups/${id}/examinations/detail?exam=${item.id}`
                    }
                  >
                    {type === 0 ? (
                      <div className={classes.titleCol}>
                        {HTMLReactParser(item.title)}
                      </div>
                    ) : (
                      <div className={classes.titleCol}>
                        <Typography>{item.title}</Typography>
                      </div>
                    )}
                  </MLink>
                </TableCell>
                <TableCell>
                  <Typography>
                    {dateFormat(
                      new Date(item.createdOn),
                      'HH:MM TT, dd-mmmm-yyyy'
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
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

function getListAfterSearch(list1, list2, filterName, type) {
  let result = [];
  if (type === 0) {
    result = list1.filter((item) =>
      item.title.toLowerCase().includes(filterName.toLowerCase())
    );
  } else {
    result = list2.filter((item) =>
      item.title.toLowerCase().includes(filterName.toLowerCase())
    );
  }
  return result;
}

function getDisplayListForPagination(
  list1,
  list2,
  start,
  numberOfItemsPerPage,
  filterName,
  type
) {
  let result = [];
  if (type === 0) {
    result = list1
      .filter((item) =>
        item.title.toLowerCase().includes(filterName.toLowerCase())
      )
      .slice(start * numberOfItemsPerPage, (start + 1) * numberOfItemsPerPage);
  } else {
    result = list2
      .filter((item) =>
        item.title.toLowerCase().includes(filterName.toLowerCase())
      )
      .slice(start * numberOfItemsPerPage, (start + 1) * numberOfItemsPerPage);
  }
  return result;
}
