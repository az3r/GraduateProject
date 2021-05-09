import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Link, OutlinedInput } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Pagination } from '@material-ui/lab';
import { getParticipants } from '@libs/client/problems';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: theme.palette.background.paper,
    height: '500px',
    overflow: 'scroll',
    overflowX: 'hidden',
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
}));

const ITEMS_PER_PAGE = 10;

export default function ParticipantsTab({ problemProp }) {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);
  const [filtedUsers, setFilterUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { id, question } = router.query;

  useEffect(async () => {
    const examJoiners = await getParticipants(problemProp);
    setParticipants(examJoiners);
    const filtered = getDisplayListForPagination(
      examJoiners,
      0,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
    const pages = getNumberOfPages(examJoiners);
    setNumberOfPages(pages);
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      participants,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterUsers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(participants, searchKey);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        participants,
        0,
        ITEMS_PER_PAGE,
        searchKey
      );
      setFilterUsers(filtered);
      setPage(1);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="center">
        <OutlinedInput
          value={searchKey}
          className={classes.outlinedInput}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search by name or email..."
        />
      </Box>
      {filtedUsers.length === 0 ? (
        <Typography>Participants are empty</Typography>
      ) : (
        <List className={classes.root}>
          {filtedUsers.map((value) => (
            <div key={value.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={value.avatar} />
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
                      <Link
                        target="_blank"
                        href={`/company-groups/${id}/questions-bank/result?question=${question}&uid=${value.id}`}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{ float: 'right' }}
                        >
                          Result
                        </Button>
                      </Link>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      )}
      <Box display="flex" justifyContent="center" p={2}>
        <Pagination
          count={numberOfPages}
          page={page}
          color="primary"
          onChange={handleChangePage}
        />
      </Box>
    </div>
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
