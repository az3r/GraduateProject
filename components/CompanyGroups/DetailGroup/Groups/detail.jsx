import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  OutlinedInput,
  Slide,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addMemberIntoGroup } from '@libs/client/companies';
import { useRouter } from 'next/router';
import Link from 'next/link';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: '700px',
    margin: 'auto',
  },
  inline: {
    display: 'inline',
  },
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});

const ITEMS_PER_PAGE = 10;

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function AddMember({ user, group, developers, isDev }) {
  const classes = useStyles();
  const [filtedUsers, setFilterUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(true);

  const [filtedUsers2, setFilterUsers2] = useState([]);
  const [searchKey2, setSearchKey2] = useState('');
  const [numberOfPages2, setNumberOfPages2] = useState(1);
  const [page2, setPage2] = useState(1);

  const route = useRouter();
  const { id, idGroup } = route.query;

  React.useEffect(async () => {
    const filtered = getDisplayListForPagination(
      group.developers || [],
      0,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
    const pages = getNumberOfPages(group.developers || []);
    setNumberOfPages(pages);
    setLoad(false);
  }, []);

  React.useEffect(async () => {
    const filtered = getDisplayListForPagination(
      developers || [],
      0,
      ITEMS_PER_PAGE,
      searchKey2
    );
    setFilterUsers2(filtered);
    const pages = getNumberOfPages(developers || []);
    setNumberOfPages2(pages);
  }, []);

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      group.developers || [],
      value - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(group.developers, searchKey);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        group.developers || [],
        0,
        ITEMS_PER_PAGE,
        searchKey
      );
      setFilterUsers(filtered);
      setPage(1);
    }
  };

  const handleSearchChange2 = (e) => {
    setSearchKey2(e.target.value);
  };

  const handleSearchKeyPress2 = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(developers, searchKey2);
      const pages = getNumberOfPages(newList);
      setNumberOfPages2(pages);
      const filtered = getDisplayListForPagination(
        developers || [],
        0,
        ITEMS_PER_PAGE,
        searchKey2
      );
      setFilterUsers2(filtered);
      setPage2(1);
    }
  };

  const handleChangePage2 = (event, value) => {
    setPage2(value);
    const filtered = getDisplayListForPagination(
      developers || [],
      value - 1,
      ITEMS_PER_PAGE,
      searchKey2
    );
    setFilterUsers2(filtered);
  };

  const addMember = async (dev) => {
    const index = developers.findIndex((item) => item.id === dev.id);
    developers.splice(index, 1);
    const filtered2 = getDisplayListForPagination(
      developers,
      page2 - 1,
      ITEMS_PER_PAGE,
      searchKey2
    );
    setFilterUsers2(filtered2);

    await addMemberIntoGroup({
      developerId: dev.id,
      companyId: id,
      groupId: idGroup,
    });
    group.developers = group.developers ? [...group.developers, dev] : [dev];
    const filtered = getDisplayListForPagination(
      group.developers,
      page - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
    const pages = getNumberOfPages(group.developers);
    setNumberOfPages(pages);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link href={!isDev ? `/company-groups/${id}` : "#"}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/groups`}>
          <Typography className={classes.linkStyle}>Groups</Typography>
        </Link>
        <Typography color="textPrimary">Detail</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Box display="flex" justifyContent="center">
        <OutlinedInput
          value={searchKey}
          className={classes.outlinedInput}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search by name or email..."
        />
      </Box>
      {user.id === id ? (
        <Box m={3} display="flex" justifyContent="flex-end">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add members
          </Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              style={{ width: '500px' }}
            >
              Add members
            </DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="center">
                <OutlinedInput
                  value={searchKey2}
                  className={classes.outlinedInput}
                  onChange={handleSearchChange2}
                  onKeyPress={handleSearchKeyPress2}
                  placeholder="Search by name or email..."
                />
              </Box>
              <List className={classes.root}>
                {filtedUsers2.map((value) => (
                  <div key={value.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={value.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={value.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {value.email}
                            </Typography>
                            <Button
                              color="primary"
                              variant="contained"
                              style={{ float: 'right' }}
                              onClick={() => addMember(value)}
                            >
                              Add
                            </Button>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                ))}
              </List>
              <Box display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={numberOfPages2}
                  page={page2}
                  color="primary"
                  onChange={handleChangePage2}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : null}
      <Box m={1}>
        <Typography variant="h3">{group.name}</Typography>
        <Typography>Total members: {group.total}</Typography>
        <Divider />
      </Box>
      <List className={classes.root}>
        {load ? (
          <CircularProgress />
        ) : (
          filtedUsers.map((value) => (
            <div key={value.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={value.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={value.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {value.email}
                      </Typography>
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ float: 'right' }}
                        href={`/company-groups/${id}/groups/detailDev?idGroup=${idGroup}&uid=${value.id}`}
                        target="_blank"
                        disabled={isDev ? user.id !== value.id : false}
                      >
                        Detail
                      </Button>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))
        )}
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

function getListAfterSearch(list, filterName) {
  const result = list.filter(
    (item) =>
      item.name.toLowerCase().includes(filterName.toLowerCase()) ||
      item.email.toLowerCase().includes(filterName.toLowerCase())
  );
  return result;
}

function getDisplayListForPagination(
  list,
  start,
  numberOfItemsPerPage,
  filterName
) {
  const result = list
    .filter(
      (item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase()) ||
        item.email.toLowerCase().includes(filterName.toLowerCase())
    )
    .slice(start * numberOfItemsPerPage, (start + 1) * numberOfItemsPerPage);
  return result;
}
