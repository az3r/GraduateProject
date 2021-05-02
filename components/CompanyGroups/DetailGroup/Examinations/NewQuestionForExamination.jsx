import { FirebaseAuth } from '@libs/client/firebase';
import { Box, Checkbox, Divider, FormControlLabel, Select, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import CodingQuestionForm from '../QuestionsBank/CodingQuestionForm';
import MultipleChoiceForm from '../QuestionsBank/MultipleChoiceForm';


export default function NewQuestionForExamination({onFormSubmit}){
    const [type,setType] = useState(1);

    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleChangeType = (e)=>{
        setType(Number(e.target.value));
    }

    const handleSubmitForm = (question) => {
        question.developerId = FirebaseAuth().currentUser.uid;
        onFormSubmit(question, checked);
    }

    return(
        <Box m={3}>
            <Box m={1} display="flex" justifyContent="center">
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
            <Box m={1} display="flex" justifyContent="center">
                <FormControlLabel
                        control={<Checkbox checked={checked}
                                    onChange={handleChange}
                                    color="primary" />}
                        label="Save to company's questions library"
                />
            </Box>

            <Divider/>
            {
                type === 1 ? 
                <CodingQuestionForm onFormSubmit={handleSubmitForm} propQuestion={null} isSaved={checked}/>
                : 
                <MultipleChoiceForm onFormSubmit={handleSubmitForm} propQuestion={null}/>
            }
        </Box>
    );
}