import { MemberAppBar } from '../AppBar';

import {
  makeStyles
} from '@material-ui/core';

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

export default function Layout(props) {
  const classes = useStyles();

  return (
    <>
      <GuestAppBar />
      <div className={classes.root}>{props.children}</div>
    </>
  );
}
