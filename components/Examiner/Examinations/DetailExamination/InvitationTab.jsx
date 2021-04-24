// import { get } from '@libs/client/users';
// import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
// import Typography from '@material-ui/core/Typography';
// import { Box, Button, OutlinedInput, TextField } from '@material-ui/core';
// import { inviteUsers } from '@libs/client/exams';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';
// import { getUsersForInvitation, sendInvitation } from '@libs/client/business';
// import { Pagination } from '@material-ui/lab';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     maxWidth: '500px',
//     backgroundColor: theme.palette.background.paper,
//     height: '500px',
//     overflow: 'scroll',
//     overflowX: 'hidden',
//     margin: 'auto',
//   },
//   inline: {
//     display: 'inline',
//   },
//   outlinedInput: {
//     height: 30,
//     margin: 20,
//     width: 350,
//     borderRadius: 16,
//   },
// }));

// const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

//  const ITEMS_PER_PAGE = 3;

// export default function InvitationTab({ exam }) {
//   const classes = useStyles();
//   const [users, setUsers] = useState([]);
//   const [filtedUsers,setFilterUsers] = useState([]);
//   const [examiner, setExaminer] = useState({});
//   const [email,setEmail] = useState("");
//   const [open, setOpen] = useState(false);
//   const [searchKey,setSearchKey] = useState("");
//   const [sendEmailNotify,setSendEmailNotify] = useState("");
//   const [numberOfPages,setNumberOfPages] = useState(1);
//   const [page,setPage] = useState(1);

//   React.useEffect(async () => {
//     const examOwner = await get(exam.owner);
//     setExaminer(examOwner);
//     const modifiedUsers = await getUsersForInvitation(exam.id);
//     setUsers(modifiedUsers);
//     const filtered = getDisplayListForPagination(modifiedUsers,0,ITEMS_PER_PAGE,searchKey);
//     setFilterUsers(filtered);
//     const pages = getNumberOfPages(modifiedUsers);
//     setNumberOfPages(pages)
//   }, []);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChangeInvitationEmail = (e) => {
//     setEmail(e.target.value);
//   }

//   const handleSearchChange = (e) => {
//     setSearchKey(e.target.value);
//   }

//   const handleChangePage = (event, value) => {
//     setPage(value);
//     const filtered = getDisplayListForPagination(users,value-1,ITEMS_PER_PAGE,searchKey);
//     setFilterUsers(filtered);
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       const newList = getListAfterSearch(users,searchKey);
//       const pages = getNumberOfPages(newList);
//       setNumberOfPages(pages)
//       const filtered = getDisplayListForPagination(users,0,ITEMS_PER_PAGE,searchKey);
//       setFilterUsers(filtered);
//     }
//   }

//   const sendInivation = (invitedUser) => {
//     inviteUsers(exam.id,invitedUser.email);
//     sendInvitation(invitedUser.name,examiner.name,exam.id,exam.password,invitedUser.email);
//     const newUsers = [...users];
//     const index = newUsers.findIndex(user => user.id === invitedUser.id);
//     newUsers[index].isInvited = true;
//     setUsers(newUsers);
//   };

//   const sendInvitationByEmail = async () => {
//     inviteUsers(exam.id,email);
//     setSendEmailNotify(`Sent invitation to email ${email}`);
//     sendInvitation("Examinee",examiner.name,exam.id,exam.password,email);
//     const modifiedUsers = await getUsersForInvitation(exam.id);
//     setUsers(modifiedUsers);
//     const filtered = getDisplayListForPagination(modifiedUsers,0,ITEMS_PER_PAGE,"");
//     setFilterUsers(filtered);
//     const pages = getNumberOfPages(modifiedUsers);
//     setNumberOfPages(pages)
//     setSearchKey("");
//     setPage(1);
//   };

//   return (
//     <div>
//       <Typography>
//         Let&apos;s invite examinee to join your examination
//       </Typography>
//       <Box display="flex" justifyContent="flex-end">
//         <Button color="secondary" variant="contained" onClick={handleClickOpen}>Send invitation by email</Button>
//         <Dialog
//             open={open}
//             TransitionComponent={Transition}
//             keepMounted
//             onClose={handleClose}
//             aria-labelledby="alert-dialog-slide-title"
//             aria-describedby="alert-dialog-slide-description"
//         >
//             <DialogTitle id="alert-dialog-slide-title" style={{width: "500px"}}>Invite participant by email</DialogTitle>
//             <DialogContent>
//                 <DialogContentText id="alert-dialog-slide-description">
//                   <TextField label="Enter email" style={{width: "100%"}} onChange={handleChangeInvitationEmail}/>
//                   <Typography>{sendEmailNotify}</Typography>
//                 </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={sendInvitationByEmail} color="primary">
//                     Send
//                 </Button>
//                 <Button onClick={handleClose}>
//                     Close
//                 </Button>
//             </DialogActions>
//         </Dialog>
//       </Box>
//       <Box display="flex" justifyContent="center">
//         <OutlinedInput
//           value={searchKey}
//           className={classes.outlinedInput}
//           onChange={handleSearchChange}
//           onKeyPress={handleSearchKeyPress}
//           placeholder="Search by name or email..."
//         />
//       </Box>
//       <List className={classes.root}>
//         {filtedUsers.map((value) => (
//           <div key={value.id}>
//             <ListItem alignItems="flex-start">
//               <ListItemAvatar>
//                 <Avatar alt="Remy Sharp" src={value.avatar} />
//               </ListItemAvatar>
//               <ListItemText
//                 primary={value.name}
//                 secondary={
//                   <>
//                     <Typography
//                       component="span"
//                       variant="body2"
//                       className={classes.inline}
//                       color="textPrimary"
//                     >
//                       {value.email}
//                     </Typography>
//                     {value.isInvited ? (
//                       <Button
//                         color="primary"
//                         variant="contained"
//                         style={{ float: 'right' }}
//                         disabled
//                       >
//                         Invited
//                       </Button>
//                     ) : (
//                       <Button
//                         color="primary"
//                         variant="contained"
//                         style={{ float: 'right' }}
//                         onClick={() => sendInivation(value)}
//                       >
//                         Invite
//                       </Button>
//                     )}
//                   </>
//                 }
//               />
//             </ListItem>
//             <Divider variant="inset" component="li" />
//           </div>
//         ))}
//       </List>
//       <Box display="flex" justifyContent="center" p={2}>
//         <Pagination count={numberOfPages} page={page} color="primary" onChange={handleChangePage} />
//       </Box>
//     </div>
//   );
// }

// function getNumberOfPages(list)
// {
//   return list.length % ITEMS_PER_PAGE === 0 ? Math.floor(list.length / ITEMS_PER_PAGE) : Math.floor(list.length / ITEMS_PER_PAGE) + 1;
// }

// function getListAfterSearch(list,filterName)
// {
//   const result = list.filter(item => item.name.toLowerCase().includes(filterName.toLowerCase()) 
//                                        || item.email.toLowerCase().includes(filterName.toLowerCase()));
//   return result;
// }

// function getDisplayListForPagination(list,start,numberOfItemsPerPage,filterName)
// {
//   const result = list.filter(item => item.name.toLowerCase().includes(filterName.toLowerCase()) 
//                                       || item.email.toLowerCase().includes(filterName.toLowerCase()))
//                       .slice(start*numberOfItemsPerPage, (start+1)*numberOfItemsPerPage);
//   return result;
// }