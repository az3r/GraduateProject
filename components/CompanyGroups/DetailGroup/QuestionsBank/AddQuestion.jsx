import { FirebaseAuth } from '@libs/client/firebase';
import { create, createMCQ } from '@libs/client/problems';
import { Box, Breadcrumbs, Button, Divider, Select, Slide, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Link from 'next/link';
import React, { useState } from 'react';
import CodingQuestionForm from './CodingQuestionForm';
import MultipleChoiceForm from './MultipleChoiceForm';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddQuestion()
{
    const [type,setType] = useState(1);
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeType = (e)=>{
        setType(Number(e.target.value));
    }

    const onFormSubmit = async (question) => {
        let id = '';
        if(!question.isMCQ)
        {
            id = await create(FirebaseAuth().currentUser.uid,question);
        }
        else
        {
            id = await createMCQ(FirebaseAuth().currentUser.uid,question);
        }

        if(id !== '') setOpen(true);
    }

    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link href="/company-groups">
                    Company groups
                </Link>
                <Link href="/company-groups/1">
                    1
                </Link>
                <Link href="/company-groups/1/questions-bank">
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
                    <CodingQuestionForm onFormSubmit={onFormSubmit} propQuestion={null} displayScrollSpy/>
                    : 
                    <MultipleChoiceForm onFormSubmit={onFormSubmit} propQuestion={null} displayScrollSpy/>
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
                        <Link href="/company-groups/1/questions-bank">Back to questions bank</Link>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
