import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import { Box, Button, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    midth: '100%',
    maxWidth: '100ch',
    margin: 'auto'
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  item:{
      marginBottom: '10px'
  },
  addGroupBtn:{
      marginBottom: "50px",
      textAlign: "center"
  },
  groupIcon: {
      backgroundColor: "#052856"
  },
  groupIcon2: {
    backgroundColor: "#C6441A"
}
}));



export default function CompanyGroups(){
    const classes = useStyles();
    return (
        <Box m={1} p={2} className={classes.root}>
            <Typography variant="h5" >Your Company Groups</Typography>
            <Divider/>
            <List >
            <ListItem className={classes.item}>
                  <ListItemAvatar >
                    <Avatar className={classes.groupIcon}>
                      <GroupIcon/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" color="secondary">
                        Detail group
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item}>
                  <ListItemAvatar >
                    <Avatar className={classes.groupIcon2}>
                      <GroupIcon/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" color="secondary">
                        Detail group
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item}>
                  <ListItemAvatar >
                    <Avatar className={classes.groupIcon}>
                      <GroupIcon/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" color="secondary">
                        Detail group
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
            </List>
        </Box>
    );
}