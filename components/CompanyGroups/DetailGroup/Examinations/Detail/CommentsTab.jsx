import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Box, Link } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Pagination } from '@material-ui/lab';
import { getExamComments } from '@libs/client/comments';
import HTMLReactParser from 'html-react-parser';

const useStyles = makeStyles({
  root: {
    width: '100%',
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
});

const ITEMS_PER_PAGE = 10;

export default function CommentsTab() {
  const [comments, setComments] = useState([]);
  const [filtedComments, setFiltedComments] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const router = useRouter();
  const { exam } = router.query;

  useEffect(async () => {
    const cmts = await getExamComments(exam);
    setComments(cmts);
    setNumberOfPages(getNumberOfPages(cmts));
    const temp = getDisplayListForPagination(cmts, 0, ITEMS_PER_PAGE);
    setFiltedComments(temp);
  }, []);

  const handleChangePage = (event, value) => {
    const temp = getDisplayListForPagination(
      comments,
      value - 1,
      ITEMS_PER_PAGE
    );
    setFiltedComments(temp);
    setPage(value);
  };

  return (
    <div>
      {filtedComments.length === 0 ? (
        <Typography>Comments are empty</Typography>
      ) : (
        <List className={classes.root}>
          {filtedComments.map((value) => (
            <div key={value.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={value.avatar} />
                </ListItemAvatar>
                <ListItemText
                  style={{ wordBreak: 'break-word' }}
                  primary={<Link href={`/profile/dev/${value.userId}`} color="secondary">{value.username}</Link>}
                  secondary={HTMLReactParser(value.content)}
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

function getDisplayListForPagination(list, start, numberOfItemsPerPage) {
  const result = list.slice(
    start * numberOfItemsPerPage,
    (start + 1) * numberOfItemsPerPage
  );
  return result;
}
