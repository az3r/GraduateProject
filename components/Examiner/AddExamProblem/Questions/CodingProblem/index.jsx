import { Box, Button, Grid, makeStyles, NativeSelect, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SkewLoader from "react-spinners/SkewLoader";
import CodeEditor from '../../../../CodeEditor';


const useStyles = makeStyles({
    textSuccess: {
        color: '#52C41A'
    },
    textFail: {
        color: '#F74B4D'
    }
})



export default function CodingProblem({
        NO,value,
        handleChangeCPTitle,handleChangeCPInfo,handleChangeCPDifficulty,handleChangeScore,
        handleChangeLanguague,handleChangeCPCode,handleChangeSimpleTest,handleTestCode,handleChangeCPFiles,
        handleChangeTime}){
    
    const classes = useStyles();

    const handleChangeInfo = (event,editor) => {
        // eslint-disable-next-line no-shadow
        const value = editor.getData();
        handleChangeCPInfo(NO,value);
    }

    const handleOnChangeCode = (newCode) => {
        handleChangeCPCode(NO,newCode);
    }

    return(
        <Box boxShadow={4} p={2}>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter title: </Typography>
                <TextField
                    id={`CP_${NO}`}
                    onChange={handleChangeCPTitle} fullWidth required />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter information: </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onChange={handleChangeInfo} />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose level of difficulty: </Typography>
                <NativeSelect id={`CP_${NO}`}
                    onChange={handleChangeCPDifficulty}>
                    <option value={0}>Easy</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Hard</option>
                </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter score: </Typography>
                <input id={`CP_${NO}`} onChange={handleChangeScore} type="number" max="100" min="0" value={value.Score} />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Enter time by minute (min: 0.5, max: 100): </Typography>
                    <input id={`MC_${NO}`}  onChange={handleChangeTime} type="number" max="100" min="0.5" value={value.Time}  />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose programming language: </Typography>
                <NativeSelect
                    onChange={handleChangeLanguague} id={`CP_${NO}`}>
                    <option value="Csharp">C#</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Grid container>
                    <Grid item lg={6}>
                        <Typography variant="h5">Enter code: </Typography>
                        <CodeEditor language={value.Language}  code={value.Code} onCodeChange={handleOnChangeCode}  />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5">Notes:</Typography>
                        <ul>
                            <li><Typography>Write full your code in the coding editor</Typography></li>
                            <li><Typography>Enter simple input and output to test your code (include only one test case)</Typography></li>
                            <li><Typography>Click Test code button to test your code and input, output</Typography></li>
                        </ul>

                        <div>
                            <TextField id={`CP_${NO}_SimpleIn`} multiline label="Enter simple input" onChange={handleChangeSimpleTest} />
                        </div>
                        <div>
                            <TextField id={`CP_${NO}_SimpleOut`} multiline label="Enter simple output" onChange={handleChangeSimpleTest} />
                        </div>
                        <br />

                        <Typography className={value.TestCodeSuccess ? classes.textSuccess : classes.textFail}>{value.MessageTestCode}</Typography>
                        <div>
                            <SkewLoader color="#088247"  loading={value.IsLoadingTestCode} size={20} />
                        </div>
                        <Button variant="primary" id={`CP_${NO}`} onClick={handleTestCode}>Test code</Button>
                    </Grid>
                </Grid>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit input file: </Typography>
                <input id={`CP_${NO}_In`} type="file" onChange={handleChangeCPFiles} />
            </Box>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit expected output file: </Typography>
                <input id={`CP_${NO}_Out`} type="file" onChange={handleChangeCPFiles} />
            </Box>
        </Box>
    )
}