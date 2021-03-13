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
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@libs/client';
import { useAuth } from '@hooks/auth';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
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
    <AppBar position="static">
      <Toolbar className={styles.menu}>
        <IconButton className={styles.menuItem} edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
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
        <Link href="/examiner">
          <MenuItem>
            <Typography variant="h6">Examiner</Typography>
          </MenuItem>
        </Link>
        <Box flexGrow={1} />
        <IconButton onClick={() => setOpen(!open)} ref={anchorRef}>
          <Avatar alt="user's profile" src={user.photoURL} />
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
                  <CompanyActions />
                </Paper>
              </ClickAwayListener>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
}

function CompanyActions() {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  async function logout() {
    await auth.signout();
    removeCookie("user");
    await router.push('/');
  }

  return (
    <MenuList>
      <Link href="/profile">
        <MenuItem>Profile</MenuItem>
      </Link>
      <Link href="/setting">
        <MenuItem>Setting</MenuItem>
      </Link>
      <MenuItem onClick={logout}>Sign out</MenuItem>
    </MenuList>
  );
}
