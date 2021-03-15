import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CodeEditor from '@components/CodeEditor';
import { Box, Typography, TextField, NativeSelect, Grid, Button, makeStyles } from '@material-ui/core';
import SkewLoader from 'react-spinners/SkewLoader';
import React from 'react';


const useStyles = makeStyles({
    textSuccess: {
      color: '#52C41A',
    },
    textFail: {
      color: '#F74B4D',
    },
    testFont: {
        fontSize: "12px",
        wordWrap: "break-word",
    }
  });

export default function CodeProblem({problem,handleChangeTestName,handleChangeTestIntro,
    handleChangeDifficulty,handleChangeScore,handleChangeLanguague,handleOnChangeCode,
    handleChangeSimpleInput,handleChangeSimpleOutput,handleTestCode,handleChangeInputFile,
    handleChangeOutputFile,message,isLoading, isTestSuccess}){
    const classes = useStyles();

    return(
        <>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter problem title: </Typography>
                {
                    message.title ?
                    <TextField onChange={handleChangeTestName} value={problem.title} fullWidth />
                    :
                    <TextField onChange={handleChangeTestName} value={problem.title} fullWidth 
                    error
                    helperText="Enter problem title"/>
                }
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter problem content: </Typography>
                <CKEditor
                    editor={ClassicEditor}
                    data={problem.content}
                    onChange={handleChangeTestIntro}
                />
                {
                    message.content ? 
                    null : <Typography className={classes.textFail}>Enter problem content</Typography>
                }
            </Box>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose level of difficulty: </Typography>
                <NativeSelect
                    inputProps={{ 'aria-label': 'age' }}
                    onChange={handleChangeDifficulty}
                >
                    {
                        problem.difficulty === 0 ?
                        <option selected value={0}>Easy</option>
                        : 
                        <option value={0}>Easy</option>
                    }
                    {
                        problem.difficulty === 1 ?
                        <option selected value={1}>Medium</option>
                        : 
                        <option value={1}>Medium</option>
                    }
                    {
                        problem.difficulty === 2 ?
                        <option selected value={2}>Hard</option>
                        : 
                        <option value={2}>Hard</option>
                    }
                </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter score: </Typography>
                <TextField
                    onChange={handleChangeScore}
                    type="number"
                    value={problem.score}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: { 
                            max: 100, min: 10 
                        }
                    }} 
                />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
            <Typography variant="h5">Choose programming language: </Typography>
            <NativeSelect
                inputProps={{ 'aria-label': 'age' }}
                onChange={handleChangeLanguague}
            >
                {
                    problem.language === 'Csharp' ?
                    <option selected value="Csharp">C#</option> 
                    : 
                    <option value="Csharp">C#</option>
                }
                {
                    problem.language === 'Java' ?
                    <option selected value="Java">Java</option>
                    : 
                    <option value="Java">Java</option>
                }
                 {
                    problem.language === 'Python' ?
                    <option selected value="Python">Python</option>
                    : 
                    <option value="Python">Python</option>
                }
            </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Grid container spacing={3} direction="row">
                    <Grid item>
                    <Typography variant="h5">Enter code: </Typography>
                    <CodeEditor
                        language={problem.language}
                        code={problem.code}
                        onCodeChange={handleOnChangeCode}
                    />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Notes:</Typography>
                        <ul>
                            <li>
                            <Typography>
                                Write full your code in the coding editor
                            </Typography>
                            </li>
                            <li>
                            <Typography>
                                Enter simple input and output to test your code (include
                                only one test case)
                            </Typography>
                            </li>
                            <li>
                            <Typography>
                                Click &quot;Test code&quot; button to test your code and
                                input, output
                            </Typography>
                            </li>
                        </ul>

                        <div>
                        {
                            message.testInput ? 
                            <TextField
                            multiline
                            label="Enter simple input"
                            onChange={handleChangeSimpleInput}
                            /> : 
                            <TextField
                            multiline
                            label="Enter simple input"
                            onChange={handleChangeSimpleInput}
                            error
                            helperText="Enter simple input test case"
                            />
                        }
                        </div>
                        <div>
                        {
                            message.testOutput ? 
                            <TextField
                            multiline
                            label="Enter simple output"
                            onChange={handleChangeSimpleOutput}
                            /> : 
                            <TextField
                            multiline
                            label="Enter simple output"
                            onChange={handleChangeSimpleOutput}
                            error
                            helperText="Enter simple output test case"
                            />
                        }
                        </div>
                        <br/>

                        <div>
                            <Button variant="primary" onClick={handleTestCode}>
                            Test code
                            </Button>
                            <SkewLoader color="#088247" loading={isLoading} size={20} />
                        </div>
                        <pre
                            className={
                            [isTestSuccess ? classes.textSuccess : classes.textFail,classes.testFont].join(" ")
                            }
                        >
                            {message.testMessage}
                        </pre>
                    </Grid>
                </Grid>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit input file: </Typography>
                <input
                    type="file"
                    name="inputFile"
                    onChange={handleChangeInputFile}
                />
                {
                    message.input ? 
                    null : <Typography className={classes.textFail}>Submit input file</Typography>
                }
            </Box>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit expected output file: </Typography>
                <input
                    type="file"
                    name="outputFile"
                    onChange={handleChangeOutputFile}
                />
                {
                    message.output ? 
                    null : <Typography className={classes.textFail}>Submit output file</Typography>
                }
            </Box>
        </>
    )
}