import { Box} from '@material-ui/core';
import React from 'react';
import CodingQuestionForm from '../QuestionsBank/CodingQuestionForm';
import MultipleChoiceForm from '../QuestionsBank/MultipleChoiceForm';


export default function EditQuestionForExamination({question, onFormSubmitEdit}){
    const handleSubmitForm = (editedQuestion) => {
        onFormSubmitEdit(editedQuestion);
    }

    return(
        <Box m={3}>
            {
                question.isMCQ ? 
                <MultipleChoiceForm onFormSubmit={handleSubmitForm} propQuestion={question}/>
                :
                <CodingQuestionForm onFormSubmit={handleSubmitForm} propQuestion={question}/>
            }
        </Box>
    );
}