import { update, updateMCQ } from '@libs/client/problems';
import { Box, Breadcrumbs, Button, Divider, Grid, makeStyles, Slide, Typography } from '@material-ui/core';
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

export default function UpdateQuestion({problemProp})
{
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {id} = router.query;
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };
    const onFormSubmit = async (question) => {
        if(!question.isMCQ)
            await update(problemProp.id,{
                cases: question.cases,
                code: question.code,
                content: question.content,
                difficulty: question.difficulty,
                language: question.language,
                title: question.title,
                published: question.published
            });
        else
            await updateMCQ(problemProp.id,{
                title: question.title,
                difficulty: question.difficulty,
                score: question.score,
                answers: question.answers,
                correctIndices: question.correctIndices
            })
        
        setOpen(true);
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
                        <Link href={`/company-groups/${id}/questions-bank/detail?question=${problemProp.id}`}>
                            Detail
                        </Link>
                        <Typography color="textPrimary">Update</Typography>
                    </Breadcrumbs>
                    <Divider/>

                    <Box m={3}>
                        {
                            problemProp.isMCQ ? 
                            <MultipleChoiceForm onFormSubmit={onFormSubmit} propQuestion={problemProp}/>:
                            <CodingQuestionForm onFormSubmit={onFormSubmit} propQuestion={problemProp} isSaved/>
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
                                        Update question completed
                                    </Typography>
                                </Box>
                                <Link href={`/company-groups/${id}/questions-bank/detail?question=${problemProp.id}`}>Back to question</Link>
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
                                !problemProp.isMCQ ?
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
