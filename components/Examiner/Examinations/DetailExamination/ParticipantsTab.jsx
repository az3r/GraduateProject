import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { getParticipants } from '@libs/client/exams';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: "500px",
    backgroundColor: theme.palette.background.paper,
    height: '500px',
    overflow: 'scroll',
    overflowX: 'hidden',
    margin: "auto"
  },
  inline: {
    display: 'inline',
  },
}));

export default function InvitationTab({exam})
{
    const classes = useStyles();
    const [participants,setParticipants]=useState([]);
    useEffect(async ()=>{
        const examJoiners = await getParticipants(exam.id);
        setParticipants(examJoiners);
        console.log(examJoiners);
    },[]);
    return (
        <div>
            <List className={classes.root}>
            {
                participants.map((value)=>(
                    <div key={value.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={value.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                            primary={value.name}
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {value.email}
                                    </Typography>
                                </>
                            }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))
            }
            </List>
        </div>
    );
}