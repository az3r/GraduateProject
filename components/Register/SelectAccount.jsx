import * as React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';

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
          <Typography variant="h4" align="center">
            Developer Account
          </Typography>
          <List dense>
            <ListItem alignItems="flex-start">
              <ListItemText
                primaryTypographyProps={{ variant: 'body1' }}
                primary="Solve various problems"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primaryTypographyProps={{ variant: 'body1' }}
                primary="Test your skills with other competitors by paricipating in contest"
              />
            </ListItem>
          </List>
        </Box>
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSelected('company')}
        className={styles.button}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h4">Company Account</Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primaryTypographyProps={{ variant: 'body1' }}
                primary="Create and publish problems"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primaryTypographyProps={{ variant: 'body1' }}
                primary="Organize your own contest, invite developers to participate in your contest through email"
              />
            </ListItem>
          </List>
        </Box>
      </Button>
    </Box>
  );
}

SelectAccount.propTypes = {
  onSelected: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  button: {
    padding: theme.spacing(2),
    textTransform: 'none',
    width: 328,
  },
}));
