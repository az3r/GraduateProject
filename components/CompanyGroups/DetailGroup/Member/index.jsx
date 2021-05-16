import { getMembers } from '@libs/client/companies';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  IconButton,
  makeStyles,
  OutlinedInput,
  Tooltip,
  Typography,
  Link as MLink,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import HelpIcon from '@material-ui/icons/Help';
import LinkIcon from '@material-ui/icons/Link';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  root: {
    width: 200,
    marginRight: 20,
    marginBottom: 20,
  },
  avt: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const ITEMS_PER_PAGE = 20;

export default function GroupMember({ user, company }) {
  const [members, setMembers] = useState([]);
  const [filtedMembers, setFiltedMembers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const mems = await getMembers(company);
    setMembers(mems);
    const filtered = getDisplayListForPagination(
      mems,
      0,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFiltedMembers(filtered);
    const pages = getNumberOfPages(mems);
    setNumberOfPages(pages);
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      members,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFiltedMembers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(members, searchKey);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        members,
        0,
        ITEMS_PER_PAGE,
        searchKey
      );
      setFiltedMembers(filtered);
      setPage(1);
    }
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">Group members</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Box m={3} p={2} display="flex" justifyContent="center">
        <OutlinedInput
          className={classes.outlinedInput}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search..."
        />
      </Box>
      <Box m={3} display="flex" justifyContent="flex-end">
        <Tooltip title="Only admin can add members.">
          <IconButton aria-label="delete">
            <HelpIcon />
          </IconButton>
        </Tooltip>
        <Link href={`/company-groups/${id}/members/add`}>
          <Button
            color="secondary"
            variant="contained"
            disabled={user.role !== 'company'}
          >
            Add member
          </Button>
        </Link>
      </Box>
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent style={{ wordWrap: 'break-word' }}>
            <Avatar
              alt="Remy Sharp"
              src={company.avatar}
              className={classes.avt}
            />
            <Chip
              style={{ marginBottom: 10 }}
              label="Admin"
              variant="outlined"
              size="small"
            />
            <Typography gutterBottom variant="h5" component="h2">
              {company.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {company.email}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link href={`/company-groups/${id}/members/${company.id}`}>
            <Button size="small" color="primary" variant="outlined">
              Contributions
            </Button>
          </Link>
          <IconButton color="secondary">
            <MLink target="_blank" href={`/profile/co/${company.id}`}>
              <LinkIcon />
            </MLink>
          </IconButton>
        </CardActions>
      </Card>
      <Box display="flex" flexWrap="wrap">
        {filtedMembers.map((item) => (
          <Card className={classes.root}>
            <CardActionArea>
              <CardContent style={{ wordWrap: 'break-word' }}>
                <Avatar
                  alt="Remy Sharp"
                  src={item.avatar}
                  className={classes.avt}
                />
                <Typography gutterBottom variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.email}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Link href={`/company-groups/${id}/members/${item.id}`}>
                <Button size="small" color="primary" variant="outlined">
                  Contributions
                </Button>
              </Link>
              <IconButton color="secondary">
                <MLink target="_blank" href={`/profile/dev/${item.id}`}>
                  <LinkIcon />
                </MLink>
              </IconButton>
            </CardActions>
          </Card>
        ))}
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
