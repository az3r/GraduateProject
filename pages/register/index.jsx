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
import Link from 'next/link';
import Head from 'next/head';

export default function SelectAccount() {
  const styles = useStyles();
  return (
    <Box className={styles.root}>
      <Head>
        <title>Select Account</title>
        <meta property="og-title" content="Select Account" />
      </Head>
      <Box className={styles.content}>
        <Link href="/register/developer">
          <Button variant="contained" color="primary" className={styles.button}>
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
        </Link>

        <Link href="/register/company">
          <Button variant="contained" color="primary" className={styles.button}>
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
        </Link>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '50%',
    minWidth: '700px',
    height: '50%',
    minHeight: '456px',
    display: 'flex',
    justifyContent: 'space-between',
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
