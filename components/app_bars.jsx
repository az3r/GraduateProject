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
import { useRouter } from "next/router";

function GuestAppBar() {
  const styles = useStyles();
  const router = useRouter();
  return (
    <AppBar position="static" className={styles.root}>
      <Toolbar>
        <IconButton className={styles.menu} edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography className={styles.title} variant="h6">
          Home
        </Typography>
        <Button className={styles.action} onClick={toLoginPage}>
          Login
        </Button>
        <Button className={styles.action} onClick={toRegisterPage}>
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );

  function toLoginPage(e) {
    e.preventDefault();
    router.push("/login");
  }
  function toRegisterPage(e) {
    e.preventDefault();
    router.push("/register");
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
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
