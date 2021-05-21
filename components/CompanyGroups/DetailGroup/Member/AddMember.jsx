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
  OutlinedInput,
  Slide,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { addDevelopers } from '@libs/client/companies';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { find } from '@libs/client/users';
import { sendInvitationMember } from '@libs/client/business';

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

export default function AddMember({ developers }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [filtedUsers, setFilterUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [company,setCompany] = useState({});

  const route = useRouter();
  const { id } = route.query;

  React.useEffect(async () => {
    setCompany(await find(id));
    setUsers(developers);
    const filtered = getDisplayListForPagination(
      developers,
      0,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
    const pages = getNumberOfPages(developers);
    setNumberOfPages(pages);
  }, []);

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      users,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(users, searchKey);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        users,
        0,
        ITEMS_PER_PAGE,
        searchKey
      );
      setFilterUsers(filtered);
      setPage(1);
    }
  };

  const sendInivation = async (dev) => {
    await addDevelopers(id, [dev.id]);
    sendInvitationMember(dev.name,company.name,dev.email);
    const newUsers = [...users];
    const index = newUsers.findIndex((item) => item.id === dev.id);
    newUsers.splice(index, 1);
    setUsers(newUsers);
    const pages = getNumberOfPages(newUsers);
    setNumberOfPages(pages);
    const newPage = pages >= page ? page - 1 : pages - 1;
    const filtered = getDisplayListForPagination(
      newUsers,
      newPage,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
    setPage(newPage + 1);
    setOpen(true);
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
        <Link href={`/company-groups/${id}`}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/members`}>
          <Typography className={classes.linkStyle}>Group members</Typography>
        </Link>
        <Typography color="textPrimary">Add members</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Typography>Let&apos;s invite members to thrive your group</Typography>
      <Box display="flex" justifyContent="center">
        <OutlinedInput
          value={searchKey}
          className={classes.outlinedInput}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search by name or email..."
        />
      </Box>
      <List className={classes.root}>
        {filtedUsers.length === 0 ? (
          <Typography>You have invited all</Typography>
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
                        onClick={() => sendInivation(value)}
                      >
                        Invite
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent style={{ width: 500 }}>
          <Box>
            <Box display="flex" justifyContent="center" m={3}>
              <CheckCircleIcon style={{ fontSize: 50, color: '#088247' }} />
            </Box>
            <Typography style={{ textAlign: 'center' }}>
              Add member successfully
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
