import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import React from 'react';

export default function MultipleChoices({NO,value,handleChangeQuestionMC,handleChangeAnswerMC,
    handleChangeCorrectAnswer,handleChangeScore,handleChangeTime}){
    
    const handleChangeQuestion = (event,editor) => {
        const data = editor.getData();
        handleChangeQuestionMC(NO,data);
    }

    const handleChangeAnswerA = (event,editor) => {
        const data = editor.getData();
        handleChangeAnswerMC(NO,'A',data);
    }
    const handleChangeAnswerB = (event,editor) => {
        const data = editor.getData();
        handleChangeAnswerMC(NO,'B',data);
    }
    const handleChangeAnswerC = (event,editor) => {
        const data = editor.getData();
        handleChangeAnswerMC(NO,'C',data);
    }
    const handleChangeAnswerD = (event,editor) => {
        const data = editor.getData();
        handleChangeAnswerMC(NO,'D',data);
    } 
    return(
        <Box boxShadow={4} p={2} maxWidth>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter question: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value.question}
                    onChange={handleChangeQuestion}/>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter score: </Typography>
                <input id={`MC_${NO}`} onChange={handleChangeScore} type="number" max="100" min="0" value={value.score} />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter time by minute (min: 0.5, max: 100): </Typography>
                <input id={`MC_${NO}`}  onChange={handleChangeTime} type="number" max="100" min="0.5" value={value.time}  />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter answer A: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value.a}
                    onChange={handleChangeAnswerA}/>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter answer B: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value.b}
                    onChange={handleChangeAnswerB}/>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter answer C: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value.c}
                    onChange={handleChangeAnswerC}/>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter answer D: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value.d}
                    onChange={handleChangeAnswerD}/>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose correct answer: </Typography>
                    <RadioGroup id={`MC_${NO}`} aria-label="gender" name="gender1" value={value.correct} onChange={handleChangeCorrectAnswer}>
                    <FormControlLabel value="A" control={<Radio />} label="A" />
                    <FormControlLabel value="B" control={<Radio />} label="B" />
                    <FormControlLabel value="C" control={<Radio />} label="C" />
                    <FormControlLabel value="D" control={<Radio />} label="D" />
                </RadioGroup>
            </Box>
        </Box>
    )
}