import * as React from 'react';
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';

function GuestAppBar() {
  const styles = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={styles.title} variant="h6">
          Smart Coder
        </Typography>
        <Link href="/login">
          <Button className={styles.action} href="/login">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className={styles.action} href="/register">
            Register
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  menu: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
  action: {
    width: 96,
    color: theme.palette.primary.contrastText,
  },
}));

export default GuestAppBar;
