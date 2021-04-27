import * as React from 'react';
import {
  AppBar,
  Avatar,
  IconButton,
  makeStyles,
  Toolbar,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Grow,
  Typography,
  Popper,
  Box,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@libs/client';
import { useAuth } from '@hooks/auth';
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
  title: {
    cursor: 'pointer',
  },
  grow: {
    flexGrow: 1,
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
}));

export default function MemberAppBar() {
  const styles = useStyles();
  const user = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <AppBar position="static"  style={{position: 'relative',zIndex:1}}>
      <Toolbar className={styles.menu}>
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
        <IconButton onClick={() => setOpen(!open)} ref={anchorRef}>
          <Avatar alt="user's profile" src={user.avatar} />
        </IconButton>
        <Popper
          anchorEl={anchorRef.current}
          open={open}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow
              in={TransitionProps.in}
              onEntered={TransitionProps.onEnter}
              onExit={TransitionProps.onExited}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Paper>
                  <ActionList />
                </Paper>
              </ClickAwayListener>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
}

function ActionList() {
  const router = useRouter();
  async function logout() {
    await auth.signout();
    const cookies = new Cookies();
    cookies.remove('user', {
      path: '/',
      expire: Date.now(),
    });
    await router.push('/');
  }

  return (
    <MenuList>
      <Link href="/profile/dev">
        <MenuItem>Profile</MenuItem>
      </Link>
      <Link href="/progress">
        <MenuItem>Your Progress</MenuItem>
      </Link>
      <Link href="/submissions">
        <MenuItem>Submissions</MenuItem>
      </Link>
      <MenuItem onClick={logout}>Sign out</MenuItem>
    </MenuList>
  );
}
