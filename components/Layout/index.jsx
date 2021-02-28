import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { MemberAppBar, GuestAppBar } from '../AppBar';
import { useAuth } from '../../hooks/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Layout({ children }) {
  const user = useAuth();
  const classes = useStyles();

  return (
    <>
      {user ? <MemberAppBar /> : <GuestAppBar />}
      <div className={classes.root}>{children}</div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
