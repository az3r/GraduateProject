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
import { Pagination } from '@material-ui/lab';
import dateFormat from 'dateformat';

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
    width: 480,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const ITEMS_PER_PAGE = 10;
export default function GroupQuestionsBank({ exams }) {
  const classes = useStyles();
  const [searchKey, setSearchKey] = useState('');
  const [type, setType] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [filtedExams, setFilterExams] = useState([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const filtered = getDisplayListForPagination(
      exams,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterExams(filtered);
    setNumberOfPages(getNumberOfPages(exams));
  }, []);

  const handleChangeType = (e) => {
    setType(e.target.value);
    const newList = getListAfterSearch(exams, searchKey, e.target.value);
    const pages = getNumberOfPages(newList);
    setNumberOfPages(pages);
    const filtered = getDisplayListForPagination(
      exams,
      0,
      ITEMS_PER_PAGE,
      searchKey,
      e.target.value
    );
    setFilterExams(filtered);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(exams, searchKey, type);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        exams,
        0,
        ITEMS_PER_PAGE,
        searchKey,
        type
      );
      setFilterExams(filtered);
      setPage(1);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      exams,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey,
      type
    );
    setFilterExams(filtered);
  };
  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          Company groups
        </Link>
        <Typography color="textPrimary">Current group</Typography>
        <Typography color="textPrimary">Examinations</Typography>
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
          <option value={1}>Private exams</option>
          <option value={2}>Public exams</option>
        </Select>
      </Box>
      <Box m={3} display="flex" justifyContent="flex-end">
        <Link href={`/company-groups/${id}/examinations/add`}>
          <Button color="secondary" variant="contained">
            Add examination
          </Button>
        </Link>
      </Box>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bolder' }}>Questions</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Published</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Start</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>End</TableCell>
            <TableCell style={{ fontWeight: 'bolder' }}>Public</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtedExams.length > 0 ? (
            filtedExams.map((item, index) => (
              <TableRow
                key={item.id}
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
                    href={`/company-groups/${id}/examinations/detail?exam=${item.id}`}
                  >
                    <div className={classes.titleCol}>{item.title}</div>
                  </Link>
                </TableCell>
                <TableCell align="right">{item.published ? item.published.toString() : '-'}</TableCell>
                <TableCell align="right">
                  {item.startAt ? dateFormat(
                    new Date(item.startAt),
                    'dd/mm/yyyy "at" HH:MM TT'
                  ) : '-'}
                </TableCell>
                <TableCell align="right">
                  {item.endAt ? dateFormat(new Date(item.endAt), 'dd/mm/yyyy "at" HH:MM TT') : '-'}
                </TableCell>
                <TableCell align="right">{item.isPrivate.toString()}</TableCell>
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
    result = result.filter((item) => !item.isPrivate);
  } else if (type === '2') {
    result = result.filter((item) => item.isPrivate);
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
    result = result.filter((item) => !item.isPrivate);
  } else if (type === '2') {
    result = result.filter((item) => item.isPrivate);
  }
  result = result.slice(
    start * numberOfItemsPerPage,
    (start + 1) * numberOfItemsPerPage
  );
  return result;
}
