import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { checkIsBothContributorAndMember } from '@libs/client/business';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    midth: '100%',
    maxWidth: '100ch',
    margin: 'auto',
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  item: {
    marginBottom: '10px',
  },
  addGroupBtn: {
    marginBottom: '50px',
    textAlign: 'center',
  },
  groupIcon: {
    backgroundColor: '#052856',
  },
  groupIcon2: {
    backgroundColor: '#C6441A',
  },
}));

export default function CompanyGroups({ user, companyGroups }) {
  const classes = useStyles();
  const router = useRouter();

  const handleChangePage = async (id, idCom) => {
    const check = await checkIsBothContributorAndMember(id, idCom);
    if (check) {
      router.replace(`/company-groups/${idCom}`);
    }
    else router.replace(`/company-groups/${idCom}/groups`);
  };

  return (
    <Box m={3} p={2} className={classes.root}>
      <Box m={3} p={2}>
        <Typography variant="h5">Your company groups</Typography>
        <Divider />
        {companyGroups.length > 0 ? (
          <List>
            {companyGroups.map((value) => (
              <ListItem key={value.id} ListItem className={classes.item}>
                <ListItemAvatar>
                  <Avatar src={value.avatar} />
                </ListItemAvatar>
                <ListItemText primary={value.name} />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleChangePage(user.id, value.id)}
                  >
                    Detail group
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>You are not in any groups at the moment</Typography>
        )}
      </Box>
    </Box>
  );
}
