import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  makeStyles,
  OutlinedInput,
  Typography,
  TextField,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { createGroup, isGroupAvailable } from '@libs/client/companies';

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

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ITEMS_PER_PAGE = 20;

export default function Groups({ user, groups }) {
  const [filtedGroups, setFilterGroups] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [createGroupMsg, setCreateGroupMsg] = useState({
    msg: '',
    err: false,
  });
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const filtered = getDisplayListForPagination(
      groups,
      0,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterGroups(filtered);
    const pages = getNumberOfPages(groups);
    setNumberOfPages(pages);
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
    const filtered = getDisplayListForPagination(
      groups,
      value - 1,
      ITEMS_PER_PAGE,
      searchKey
    );
    setFilterGroups(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newList = getListAfterSearch(groups, searchKey);
      const pages = getNumberOfPages(newList);
      setNumberOfPages(pages);
      const filtered = getDisplayListForPagination(
        groups,
        0,
        ITEMS_PER_PAGE,
        searchKey
      );
      setFilterGroups(filtered);
      setPage(1);
    }
  };

  const handleChangeGroupName = (e) => {
    const { value } = e.target;
    if (value.length > 20) return;
    setName(value);
    setCreateGroupMsg('');
  };

  const createGroupClick = async () => {
    const valid = await isGroupAvailable({ companyId: id, name });
    if (valid) {
      const idGroup = await createGroup({ companyId: id, name });
      setFilterGroups([
        ...filtedGroups,
        {
          id: idGroup,
          name,
        },
      ]);
      setCreateGroupMsg({
        ...createGroupMsg,
        msg: 'Create group successful',
        err: false,
      });
    } else {
      setCreateGroupMsg({
        ...createGroupMsg,
        msg: 'Group name is existed, please enter another name',
        err: true,
      });
    }
  };

  const onClose = () => {
    setOpen(false);
    setName('');
    setCreateGroupMsg({ ...createGroupMsg, msg: '' });
  };
  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">Groups</Typography>
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
      {user.role === 'company' ? (
        <Box m={3} display="flex" justifyContent="flex-end">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            New group
          </Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              style={{ width: '500px' }}
            >
              Create new group
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <TextField
                  label="Enter group name: "
                  style={{ width: '100%' }}
                  onChange={handleChangeGroupName}
                  value={name}
                />
                <Typography
                  style={
                    createGroupMsg.err ? { color: 'red' } : { color: 'green' }
                  }
                >
                  {createGroupMsg.msg}
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={createGroupClick} color="primary">
                Create
              </Button>
              <Button onClick={onClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : null}

      <Box display="flex" flexWrap="wrap">
        {filtedGroups.length === 0 ? (
          <Typography>There are no records</Typography>
        ) : (
          filtedGroups.map((item) => (
            <Card className={classes.root}>
              <CardActionArea>
                <CardContent style={{ wordWrap: 'break-word' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Link href={`/company-groups/${id}/groups/${item.id}`}>
                  <Button size="small" color="primary" variant="outlined">
                    Details
                  </Button>
                </Link>
              </CardActions>
            </Card>
          ))
        )}
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
  const result = list.filter((item) =>
    item.name.toLowerCase().includes(filterName.toLowerCase())
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
    .filter((item) =>
      item.name.toLowerCase().includes(filterName.toLowerCase())
    )
    .slice(start * numberOfItemsPerPage, (start + 1) * numberOfItemsPerPage);
  return result;
}
