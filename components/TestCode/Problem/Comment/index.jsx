import React, {useState} from 'react';
import {
  makeStyles,
  Box,
  Avatar,
  Paper,
  Button,
  TextareaAutosize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';
import { users, } from '@libs/client';


const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
    padding: 10,
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'start',
    borderRadius: 10,
    borderColor: 'green',
  },
  commentBox: {
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
  }
}));

const comments2 = [
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
    content: "Ta nói app nó tuyệt vời làm sao ấy! Ahihi. Và còn rất nhiều thứ khác mà app có thể làm được đó.",
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

export default function Comment({problemId}){
  const classes = useStyles();
  console.log(problemId); // use for eslint

  const [content, setContent] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // const [commentsArray, setCommentArray] = useState([]);
  const [editedContent, setEditedContent] = useState('');
  const [editedCommentId, setEditedCommentId] = useState('');
  const [deletedCommentId, setDeletedCommentId] = useState('');

  const handlePostComment = async () => {
    if(content === ''){
      return;
    }

    const user = await users.get();

    if(user !== null){
      // await comments.createProblemComment(problemId,
      //   {
      //     userId: user.uid,
      //     username: user.name,
      //     avatar: user.avatar,
      //     content: content
      //   });

      setContent('');
    }
  }

  const handleContentChange = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  }

  const handleEditedContentChange = (e) => {
    e.preventDefault();
    setEditedContent(e.target.value);
  }

  const handleDeleteClickOpen = ({comment}) => {
    setDeleteOpen(true);
    setDeletedCommentId(comment.id);
    console.log(deletedCommentId);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
  };

  const handleEditClickOpen = ({comment}) => {
    setEditOpen(true);
    setEditedContent(comment.content);
    setEditedCommentId(comment.id);
    console.log(editedCommentId);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleUpdate = () => {
    setEditOpen(false);
  };

  return (
    <>
      <h2 style={{marginLeft: 20, marginRight: 0, marginTop: 0, marginBottom: 0}}>{comments2.length} comments</h2>
      <Paper style={{maxHeight: window.outerHeight, height: window.outerHeight - 200, overflow: 'auto'}}>
        {
          comments2.map((comment) => (
              <Box border={2} className={classes.root}>
                <Avatar variant="square"  />
                <Box style={{marginLeft: 10, marginRight: 10}}>
                  <h3 style={{display: 'inline-block', marginLeft: 0, marginRight: 10, marginTop: 0, marginBottom: 10}}>
                    {/* <Link href={`/profile/${comment.id}`}> */}
                      <a href={`/profile/${comment.id}`} style={{color: 'green', textDecoration: 'none'}}>{comment.username}</a>
                    {/* </Link> */}
                  </h3>
                  <span style={{fontWeight: 'lighter', color: 'gray'}}>Yesterday at 12:30AM</span>
                  <div>{comment.content}</div>
                  <div>
                    <IconButton onClick={() => handleEditClickOpen({comment})} aria-label="edit" style={{padding: 0, marginLeft: 10, marginTop: 10}}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClickOpen({comment})} aria-label="delete" style={{padding: 0, marginLeft: 10, marginTop: 10}}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Box>
              </Box>
            ))
        }
        <Box className={classes.commentBox}>
          <TextareaAutosize onChange={handleContentChange} value={content} style={{width: '100%', marginBottom: 10, display: 'block'}} rowsMin={5} rowsMax={5} aria-label="textarea" placeholder="Type your comment here!" />
          <Button onClick={handlePostComment} variant="contained" color="primary" size="small" className={classes.button}>
            Post Comment
          </Button>
        </Box>
      </Paper>

      {/* Edit */}
      <Dialog open={editOpen} onClose={handleEditClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title" style={{color: 'green'}}>
        <EditIcon fontSize="medium"/>
        Are you sure?

        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to update this comment?
          </DialogContentText>
          <TextareaAutosize
            rowsMax={10}
            rowsMin={10}
            style={{width: '100%'}}
            value={editedContent}
            onChange={handleEditedContentChange}
            placeholder="Type your comments here!"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="outlined">
            Update
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{color: 'green'}}>
        <HelpOutlineRoundedIcon fontSize="medium"/>
        Are you sure?

        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary" variant="outlined">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" variant="outlined">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
