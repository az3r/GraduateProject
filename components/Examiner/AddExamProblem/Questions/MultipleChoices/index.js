import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';

export default function MultipleChoices({NO,value,handleChangeQuestionMC,handleChangeAnswerMC,handleChangeCorrectAnswer,handleChangeScore}){
    
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
        <>
            <Box boxShadow={4} p={2}>
                <Typography variant="h5" >Question #{NO+1}</Typography>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter question: </Typography>
                    <CKEditor
                        
                        editor={ ClassicEditor }
                        data={value.Question}
                        onChange={handleChangeQuestion}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter score: </Typography>
                    <input id={"MC_"+NO} onChange={handleChangeScore} type="number" max="100" min="0" value={value.Score}></input>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter answer A: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={value.A}
                        onChange={handleChangeAnswerA}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter answer B: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={value.B}
                        onChange={handleChangeAnswerB}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter answer C: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={value.C}
                        onChange={handleChangeAnswerC}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter answer D: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={value.D}
                        onChange={handleChangeAnswerD}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Choose correct answer: </Typography>
                        <RadioGroup id={"MC_"+NO} aria-label="gender" name="gender1" value={value.Correct} onChange={handleChangeCorrectAnswer}>
                        <FormControlLabel value="A" control={<Radio />} label="A" />
                        <FormControlLabel value="B" control={<Radio />} label="B" />
                        <FormControlLabel value="C" control={<Radio />} label="C" />
                        <FormControlLabel value="D" control={<Radio />} label="D" />
                    </RadioGroup>
                </Box>

            </Box>
        </>
    )
}