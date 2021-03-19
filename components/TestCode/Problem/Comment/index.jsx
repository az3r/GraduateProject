import React from 'react';
import {
  makeStyles,
  Box,
  Avatar,
  Paper,
  Button,
  TextareaAutosize,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
    padding: 10,
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'start',
    borderRadius: 10,
    borderColor: 'gray',
  },
  commentBox: {
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
  }
}));

const comments = [
  {
    id: 1,
    username: "Nguyễn Thanh Tùng",
    avatar: "/user.png",
    content: "Nice",
  },
  {
    id: 2,
    username: "Thái Thanh Tùng",
    avatar: "/user.png",
    content: "Ta nói app nó tuyệt vời làm sao ấy! Ahihi",
  },
  {
    id: 3,
    username: "Âu Dương Gia Tuấn",
    avatar: "/user.png",
    content: "App rất tiện lợi nha các bạn yêu dấu!",
  },
  {
    id: 4,
    username: "Nguyễn Mạnh Tuấn",
    avatar: "/user.png",
    content: "Tuyệt vời!",
  },
  {
    id: 5,
    username: "La Mạnh Tuấn",
    avatar: "/user.png",
    content: "Rất tin tưởng app này rất nhiều!",
  },
  {
    id: 6,
    username: "Nguyễn Thanh Tùng",
    avatar: "/user.png",
    content: "Nice",
  },
  {
    id: 7,
    username: "Thái Thanh Tùng",
    avatar: "/user.png",
    content: "Ta nói app nó tuyệt vời làm sao ấy! Ahihi",
  },
  {
    id: 8,
    username: "Âu Dương Gia Tuấn",
    avatar: "/user.png",
    content: "App rất tiện lợi nha các bạn yêu dấu!",
  },
  {
    id: 9,
    username: "Nguyễn Mạnh Tuấn",
    avatar: "/user.png",
    content: "Tuyệt vời!",
  },
  {
    id: 10,
    username: "La Mạnh Tuấn",
    avatar: "/user.png",
    content: "Rất tin tưởng app này rất nhiều!",
  }
]

export default function Comment(){
  const classes = useStyles();

  return (
    <>
      <h2 style={{marginLeft: 20, marginRight: 0, marginTop: 0, marginBottom: 0}}>20 comments</h2>
      <Paper style={{maxHeight: window.outerHeight, height: window.outerHeight - 200, overflow: 'auto',}}>
        {
          comments.map((comment) => (
              <Box border={1} className={classes.root}>
                <Avatar variant="square"  />
                <Box style={{marginLeft: 10, marginRight: 10}}>
                  <h3 style={{display: 'inline-block', marginLeft: 0, marginRight: 10, marginTop: 0, marginBottom: 10}}>{comment.username}</h3>
                  <span style={{fontWeight: 'lighter', color: 'gray'}}>Yesterday at 12:30AM</span>
                  <div>{comment.content}</div>
                </Box>
              </Box>
            ))
        }
        <Box className={classes.commentBox}>
          <TextareaAutosize style={{width: '100%', marginBottom: 10, display: 'block'}} rowsMin={5} rowsMax={5} aria-label="textarea" placeholder="Type your comment here!" />
          <Button variant="contained" color="primary" size="small" className={classes.button}>
            Post Comment
          </Button>
        </Box>
      </Paper>
    </>
  )
}
