import * as React from 'react';
import {
  AppBar,
  Avatar,
  Button,
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
  Link as MaterialLink,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FirebaseAuth } from '../../libs/firebase_client';

function MemberAppBar() {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton className={styles.menu} edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography className={styles.title} variant="h6">
          Smart Coder
        </Typography>
        <IconButton onClick={() => setOpen(!open)} ref={anchorRef}>
          <Avatar src="https://picsum.photos/200" />
        </IconButton>
        <Popper
          anchorEl={anchorRef.current}
          open={open}
          role="A list of actions which user can perform"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
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
  return (
    <>
      <MenuList>
        <Link href="/profile">
          <MenuItem>
            <MaterialLink href="/profile" color="inherit" underline="none">
              Profile
            </MaterialLink>
          </MenuItem>
        </Link>
        <Link href="/setting">
          <MenuItem>
            <MaterialLink href="/setting" color="inherit" underline="none">
              Setting
            </MaterialLink>
          </MenuItem>
        </Link>
        <MenuItem onClick={logout}>Sign out</MenuItem>
      </MenuList>
    </>
  );

  async function logout() {
    await FirebaseAuth().signOut();
    await router.push('/');
  }
}

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  menu: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
}));

export default MemberAppBar;
