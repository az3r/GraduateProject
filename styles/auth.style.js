import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    padding: theme.spacing(4),
  },
  step: {
    width: '100%',
    flexShrink: 0,
    padding: theme.spacing(0, 4, 0, 4),
  },
  input: {
    width: 400,
    margin: theme.spacing(2, 0),
  },
  button: {
    padding: theme.spacing(1),
    height: 40,
    margin: theme.spacing(4, 0, 2, 0),
  },
}));
