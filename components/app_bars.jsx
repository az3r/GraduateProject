import * as React from "react";
import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";

function GuestAppBar() {
  const styles = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton className={styles.menu} edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography className={styles.title} variant="h6">
          Home
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
  },
  action: {
    width: 96,
  },
}));

export { GuestAppBar };
