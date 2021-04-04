import React, { useEffect, useState } from 'react';
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
import { comments, users, } from '@libs/client';
import dateFormat from 'dateformat';


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'start',
    // borderRadius: 10,
    borderColor: 'green',
  },
  commentBox: {
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
  }
}));

export default function Comment({user, problemId}){
  const classes = useStyles();

  const [content, setContent] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentsArray, setCommentArray] = useState([]);
  const [editedContent, setEditedContent] = useState('');
  const [editedCommentId, setEditedCommentId] = useState('');
  const [deletedCommentId, setDeletedCommentId] = useState('');

  useEffect(async () => {
    const cmt = await comments.getProblemComments(problemId);
    setCommentArray(cmt);
  }, []);

  const handlePostComment = async () => {
    if(content === ''){
      return;
    }

    const usr = await users.get();

    if(usr !== null){
      const newlyCreatedCommentId = await comments.createProblemComment(problemId,
        {
          userId: usr.id,
          username: usr.name,
          avatar: usr.avatar,
          content
        });

      if(newlyCreatedCommentId !== null){
        const cmt = await comments.getProblemComments(problemId);
        setCommentArray(cmt);
      }

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
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    await comments.deleteProblemComment(problemId, deletedCommentId);
    const cmt = await comments.getProblemComments(problemId);
    setCommentArray(cmt);
  };

  const handleEditClickOpen = ({comment}) => {
    setEditOpen(true);
    setEditedContent(comment.content);
    setEditedCommentId(comment.id);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleUpdate = async () => {
    setEditOpen(false);
    const usr = await users.get();

    if(usr !== null) {
      await comments.updateComment(problemId, editedCommentId,
        {
          userId: usr.id,
          username: usr.name,
          avatar: usr.avatar,
          content: editedContent,
        });

      const cmt = await comments.getProblemComments(problemId);
      setCommentArray(cmt);
    }
  };

  return (
    <>
      <h2 style={{marginLeft: 20, marginRight: 0, marginTop: 0, marginBottom: 0}}>{commentsArray.length} comments</h2>
      <Paper style={{maxHeight: window.outerHeight, height: window.outerHeight - 200, overflow: 'auto'}}>
        {
          commentsArray.map((comment) => (
              <Box boxShadow={3} border={1} className={classes.root}>
                <Avatar variant="square" src={comment.avatar}  />
                <Box style={{marginLeft: 10, marginRight: 10}}>
                  <h3 style={{display: 'inline-block', marginLeft: 0, marginRight: 10, marginTop: 0, marginBottom: 10}}>
                    {/* <Link href={`/profile/${comment.id}`}> */}
                      <a href={`/profile/${comment.id}`} style={{color: 'green', textDecoration: 'none'}}>{comment.username}</a>
                    {/* </Link> */}
                  </h3>
                  <span style={{fontWeight: 'lighter', color: 'gray'}}>
                    {dateFormat(
                      new Date(comment.createdOn),
                      'mmmm dd, yyyy "at" HH:MM TT'
                    )}
                  </span>
                  <div>{comment.content}</div>
                  <div>
                      {
                        comment.userId === user.uid &&
                          <>
                            <IconButton onClick={() => handleEditClickOpen({comment})} aria-label="edit" style={{padding: 0, marginLeft: 10, marginTop: 10}}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClickOpen({comment})} aria-label="delete" style={{padding: 0, marginLeft: 10, marginTop: 10}}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                      }
                      {/* { */}
                      {/*  comment.userId !==  user.uid && */}
                      {/*    <> */}
                      {/*      <IconButton disabled onClick={() => handleEditClickOpen({comment})} aria-label="edit" style={{padding: 0, marginLeft: 10, marginTop: 10}}> */}
                      {/*        <EditIcon fontSize="small" /> */}
                      {/*      </IconButton> */}
                      {/*      <IconButton disabled onClick={() => handleDeleteClickOpen({comment})} aria-label="delete" style={{padding: 0, marginLeft: 10, marginTop: 10}}> */}
                      {/*        <DeleteIcon fontSize="small" /> */}
                      {/*      </IconButton> */}
                      {/*    </> */}
                      {/* } */}
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
