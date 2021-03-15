import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  makeStyles,
  MenuItem,
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
          <Typography className={styles.title} variant="h5">
            Smart Coder
          </Typography>
        </Link>
        <Link href="/">
          <MenuItem>
            <Typography variant="h6">Problems</Typography>
          </MenuItem>
        </Link>
        <Link href="/examination">
          <MenuItem>
            <Typography variant="h6">Examinations</Typography>
          </MenuItem>
        </Link>
        <Box flexGrow={1} />
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
    cursor: 'pointer',
  },
  action: {
    width: 128,
    textTransform: 'none',
    color: theme.palette.primary.contrastText,
  },
}));

export default GuestAppBar;
