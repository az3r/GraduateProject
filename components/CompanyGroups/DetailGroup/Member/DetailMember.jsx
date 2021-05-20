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
  Button,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import dateFormat from 'dateformat';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { removeDevelopers } from '@libs/client/companies';

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
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const { id, idMem } = router.query;

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAgree = async () => {
    await removeDevelopers(id,[idMem])
    setOpen(false);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
    router.replace(`/company-groups/${id}/members`)
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
            {listToShow.length === 0 ? (
              <Typography>There are no records</Typography>
            ) : (
              listToShow.map((item, index) => (
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
              ))
            )}
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
      <Divider />
      <Box m={5} display="flex" justifyContent="center">
        <Button
          onClick={handleClickOpen}
          variant="contained"
          style={{ color: 'red' }}
          startIcon={<DeleteIcon />}
        >
          Delete member
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent style={{ width: 500 }}>
            <Box>
              <Box display="flex" justifyContent="center" m={3}>
                <ErrorOutlineIcon style={{ fontSize: 50, color: 'red' }} />
              </Box>
              <Typography style={{ textAlign: 'center' }}>
                Do you want to delete this member?
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAgree} color="primary" autoFocus>
              Agree
            </Button>
            <Button onClick={handleClose} color="secondary">
              Disagree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={open2} onClose={handleClose2}>
          <DialogContent style={{ width: 500 }}>
            <Box>
              <Box display="flex" justifyContent="center" m={3}>
                <CheckCircleOutlineIcon
                  style={{ fontSize: 50, color: '#088247' }}
                />
              </Box>
              <Typography style={{ textAlign: 'center' }}>
                Delete successfully
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
