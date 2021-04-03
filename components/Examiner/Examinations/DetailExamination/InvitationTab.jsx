import { get, getUsers, joinExam } from '@libs/client/users';
import emailjs from 'emailjs-com';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
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
    const [users,setUsers] = useState([]);
    const [examiner,setExaminer] = useState({});

    React.useEffect(async ()=>{
        const usersDB = await getUsers("developer");
        const participants = await getParticipants(exam.id);
        const examOwner = await get(exam.owner);
        const modifiedUsers = usersDB.map( value => {
            const isInvited = participants.filter((examinee) => examinee.id === value.id).length > 0 || false;
            return {
                id : value.id,
                avatar : value.avatar,
                name: value.name,
                email : value.email,
                isInvited
            }
        });
        setUsers(modifiedUsers);
        setExaminer(examOwner);
    },[]);

    const sendInivation = (key,invitedUser) => {
        joinExam(invitedUser.id,exam.id);
        emailjs.send(
            'service_6zw4uj8', 
            'template_nm4zffi', 
            {
                to_name: invitedUser.name,
                examiner_name: examiner.name,
                exam_id: exam.id,
                exam_password: exam.password,
                send_to: invitedUser.email,
            }, 
            'user_vdAvQzs8a2nH9TdfDiLcK')
        const newUsers = [...users];
        const user = newUsers[key];
        user.isInvited = true;
        setUsers(newUsers);
    }

    return (
        <div>
            <Typography>
                Let&apos;s invite examinee to join your examination
            </Typography>
            <List className={classes.root}>
            {
                users.map((value,key)=>(
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
                                    {
                                        value.isInvited ?
                                        <Button color="primary" variant="contained" style={{float:"right"}} disabled>Invited</Button>
                                        :
                                        <Button color="primary" variant="contained" style={{float:"right"}} onClick={() => sendInivation(key,value)}>Invite</Button>

                                    }
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