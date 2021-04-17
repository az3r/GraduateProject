import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Avatar,
  Paper,
  Button,
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
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useRouter } from 'next/router';
import HTMLReactParser from 'html-react-parser';



const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 1,
    padding: 10,
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'start',
    // borderRadius: 10,
    // borderColor: 'green',
  },
  commentBox: {
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
  },
}));


export default function Comment({user, problemId}){
  const classes = useStyles();
  const router = useRouter();

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

  const MySwal = withReactContent(Swal);

  const handlePostComment = async () => {
    if(user === null){
      MySwal.fire({
        title: <p>You have not logged in yet, please log into your account!</p>,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then((result) => {
        if(result.isConfirmed){
          router.push('/login');
        }
      });
      return;
    }

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

  const handleContentChange = (event, editor) => {
    setContent(editor.getData());
  }

  const handleEditedContentChange = (event, editor) => {
    setEditedContent(editor.getData());
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
      <Paper>
        <h2 style={{marginLeft: 20, marginRight: 0, marginTop: 0, marginBottom: 0}}>{commentsArray.length} comments</h2>
        <Box className={classes.commentBox}>
          {/* <TextareaAutosize onChange={handleContentChange} value={content} style={{width: '100%', marginBottom: 10, display: 'block'}} rowsMin={5} rowsMax={5} aria-label="textarea" placeholder="Type your comment here!" /> */}
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={handleContentChange}
            onInit={editor => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
              editor.editing.view.change(writer => {
                writer.setStyle(
                  "height",
                  "200px",
                  editor.editing.view.document.getRoot()
                );
              });
            }}
             />
             <br />
          <Button onClick={handlePostComment} variant="contained" color="primary" size="small">
            Post Comment
          </Button>
        </Box>
        {
          commentsArray.map((comment) => (
            <Box boxShadow={3} className={classes.root}>
              <Avatar variant="circle" src={comment.avatar}  />
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
                <div>{HTMLReactParser(comment.content)}</div>
                <div>
                  {
                    (user && comment.userId === user.uid) &&
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
                  {/* comment.userId !==  user.uid && */}
                  {/*   <> */}
                  {/*     <IconButton disabled onClick={() => handleEditClickOpen({comment})} aria-label="edit" style={{padding: 0, marginLeft: 10, marginTop: 10}}> */}
                  {/*       <EditIcon fontSize="small" /> */}
                  {/*     </IconButton> */}
                  {/*     <IconButton disabled onClick={() => handleDeleteClickOpen({comment})} aria-label="delete" style={{padding: 0, marginLeft: 10, marginTop: 10}}> */}
                  {/*       <DeleteIcon fontSize="small" /> */}
                  {/*     </IconButton> */}
                  {/*   </> */}
                  {/* } */}
                </div>
              </Box>
            </Box>
          ))
        }
        <br />
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
          <CKEditor
            editor={ClassicEditor}
            data={editedContent}
            onChange={handleEditedContentChange}
            onInit={editor => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
              editor.editing.view.change(writer => {
                writer.setStyle(
                  "height",
                  "200px",
                  editor.editing.view.document.getRoot()
                );
              });
            }}
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
