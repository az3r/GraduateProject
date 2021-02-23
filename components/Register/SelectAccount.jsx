import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import * as React from 'react';

export default function SelectAccount({ onSelected }) {
  const styles = useStyles();
  return (
    <Box className={styles.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSelected('developer')}
        className={styles.button}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Developer Account</Typography>
        </Box>
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSelected('company')}
        className={styles.button}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Company Account</Typography>
        </Box>
      </Button>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  button: {
    width: 256,
    height: 128,
  },
}));
