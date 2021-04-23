import { FirebaseAuth } from '@libs/client/firebase';
import { create, createMCQ } from '@libs/client/problems';
import { Box, Breadcrumbs, Button, Divider, Grid, makeStyles, Select, Slide, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CodingQuestionForm from './CodingQuestionForm';
import MultipleChoiceForm from './MultipleChoiceForm';


const useStyles = makeStyles({
    textFail: {
      color: '#F74B4D',
    },
    displayScrollSpy: {
        position: "fixed",
        marginRight: "10px",
        marginLeft: "10px",
    },
    isCurrent: {
        fontWeight: 'bold',
        "& :nth-child(1)": {
            color: "#088247",
            fontSize: "14px"
          }
    },
    contentScrollSpy: {
        color: "#000000",
        fontSize: "13px",
        wordWrap: "break-word",
        textDecoration: 'none'
    },
    listContentStyle : {
        listStyle: "none",
        paddingLeft: 15
    },
    listItem: {
        marginBottom: "10px"
    },
  });

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddQuestion()
{
    const [type,setType] = useState(1);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {id} = router.query;
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeType = (e)=>{
        setType(Number(e.target.value));
    }

    const onFormSubmit = async (question) => {
        let idQuestion = '';
        if(!question.isMCQ)
        {
            idQuestion = await create(FirebaseAuth().currentUser.uid,question);
        }
        else
        {
            idQuestion = await createMCQ(FirebaseAuth().currentUser.uid,question);
        }

        if(idQuestion !== '') setOpen(true);
    }

    return(
        <Box m={3}>
            <Grid container>
                <Grid item lg={10} md={10}>
                    <Breadcrumbs>
                        <Link href="/company-groups">
                            Company groups
                        </Link>
                        <Link href={`/company-groups/${id}`}>
                            Current group
                        </Link>
                        <Link href={`/company-groups/${id}/questions-bank`}>
                            Questions bank
                        </Link>
                        <Typography color="textPrimary">Add</Typography>
                    </Breadcrumbs>
                    <Divider/>

                    <Box m={3}>
                        <Box p={2} m={1} display="flex" justifyContent="center">
                            <Typography variant="h5">Type of question:&nbsp;</Typography>
                            <Select
                                native
                                value={type}
                                onChange={handleChangeType}
                                >
                                <option value={1}>Coding question</option>
                                <option value={2}>Multiple choice question</option>
                            </Select>
                        </Box>
                        <Divider/>
                        {
                            type === 1 ? 
                            <CodingQuestionForm onFormSubmit={onFormSubmit} propQuestion={null} isSaved/>
                            : 
                            <MultipleChoiceForm onFormSubmit={onFormSubmit} propQuestion={null}/>
                        }
                    </Box>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <Box display="flex" m={3} p={2}>
                                    <CheckCircleIcon color="primary"/>
                                    <Typography variant="h5" color="primary" style={{marginLeft: 10}}>
                                        Add question completed
                                    </Typography>
                                </Box>
                                <Link href={`/company-groups/${id}/questions-bank`}>Back to questions bank</Link>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Grid>
                <Grid item lg={2} md={2}>
                        <div className={classes.displayScrollSpy}>
                            <Typography variant="h6">Content:</Typography>
                            <div className={classes.listContentStyle}>
                            {
                                type === 1 ?
                                <>
                                    <li className={classes.listItem}><a href="#CP-1" className={classes.contentScrollSpy}>Enter title</a></li>
                                    <li className={classes.listItem}><a href="#CP-2" className={classes.contentScrollSpy}>Enter content</a></li>
                                    <li className={classes.listItem}><a href="#CP-3" className={classes.contentScrollSpy}>Choose level of difficulty</a></li>
                                    <li className={classes.listItem}><a href="#CP-4" className={classes.contentScrollSpy}>Choose programming language</a></li>
                                    <li className={classes.listItem}><a href="#CP-5" className={classes.contentScrollSpy}>Enter code and test with a simple cases</a></li>
                                    <li className={classes.listItem}><a href="#CP-6" className={classes.contentScrollSpy}>Submit input/output files and enter score for each of cases</a></li>
                                    <li className={classes.listItem}><a href="#CP-7" className={classes.contentScrollSpy}>Choose to publish question</a></li>
                                    <li className={classes.listItem}><a href="#CP-8" className={classes.contentScrollSpy}>Submit problem and finish</a></li>
                                </>
                                :
                                <>
                                    <li className={classes.listItem}><a href="#MC-1" className={classes.contentScrollSpy}>Enter question</a></li>
                                    <li className={classes.listItem}><a href="#MC-2" className={classes.contentScrollSpy}>Enter score</a></li>
                                    <li className={classes.listItem}><a href="#MC-3" className={classes.contentScrollSpy}>Choose level of difficulty</a></li>
                                    <li className={classes.listItem}><a href="#MC-4" className={classes.contentScrollSpy}>Enter answers for A B C D</a></li>
                                    <li className={classes.listItem}><a href="#MC-5" className={classes.contentScrollSpy}>Choose correct answer</a></li>
                                    <li className={classes.listItem}><a href="#MC-6" className={classes.contentScrollSpy}>Submit problem and finish</a></li>
                                </>
                            }
                            </div> 
                        </div>    
                </Grid>
            </Grid>
        </Box>
    );
}