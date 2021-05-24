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
    maxWidth: '400px',
    paddingBottom: theme.spacing(1),
  },
  step: {
    width: '100%',
    flexShrink: 0,
    padding: theme.spacing(0, 4, 0, 4),
  },
  input: {
    margin: theme.spacing(2, 0),
  },
  button: {
    margin: theme.spacing(2, 0, 4, 0),
  },
}));
