import { FirebaseAuth } from '@libs/client/firebase';
import { create } from '@libs/client/problems';
import { Box, Breadcrumbs, Divider, Select, Typography } from '@material-ui/core';
import Link from 'next/link';
import React, { useState } from 'react';
import CodingQuestionForm from './CodingQuestionForm';
import MultipleChoiceForm from './MultipleChoiceForm';

export default function AddQuestion()
{
    const [type,setType] = useState(1)
    const handleChangeType = (e)=>{
        setType(Number(e.target.value));
    }

    const onFormSubmit = async (question) => {
        if(!question.isMCQ)
        {
            const id = await create(FirebaseAuth().currentUser.uid,question);
            console.log(id);
        }
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
        </Box>
    );
}