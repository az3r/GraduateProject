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
      <Link href="/">
        <Button>
          <Typography className={styles.title} variant="h6">
            Smart Coder
          </Typography>
        </Button>
      </Link>
        <Link href="/login">
          <Button className={styles.action}>
            <Typography variant="h6">Login</Typography>
          </Button>
        </Link>
        <Link href="/register">
          <Button className={styles.action}>
            <Typography variant="h6">Register</Typography>
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
  action: {
    width: 128,
    textTransform: 'none',
    color: theme.palette.primary.contrastText,
  },
}));

export default GuestAppBar;
