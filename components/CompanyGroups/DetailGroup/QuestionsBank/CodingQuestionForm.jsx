import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CodeEditor from '@components/CodeEditor';
import getTestCaseFromInputAndOutput, { getFormatResultFromFile, getInitialCode } from '@libs/client/business';
import { test } from '@libs/client/submissions';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, LinearProgress, makeStyles, NativeSelect, Slide, TextField, Tooltip, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import clsx from 'clsx';
import React, { useState } from 'react';
import Scrollspy from 'react-scrollspy';
import HelpIcon from '@material-ui/icons/Help';


const useStyles = makeStyles((theme)=>({
    whiteBackground:{
        backgroundColor: "#ffffff"
    },
    textSuccess: {
      color: '#52C41A',
    },
    textFail: {
      color: '#F74B4D',
    },
    displayScrollSpy: {
        position: "fixed",
        marginRight: "15px"
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
    },
    listItem: {
        marginBottom: "10px"
    },
    error: {
        color: 'red !important'
    },
    testCasesDialog:{
        width: 500,
        height: 300
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 500,
    },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function CodingQuestionForm({onFormSubmit, propQuestion, displayScrollSpy})
{
    const lang = propQuestion !== null ? propQuestion.language : "Csharp";
    const difficulty = propQuestion !== null ? propQuestion.difficulty : 0;
    const published = propQuestion?.published || false;

    const classes = useStyles();
    const [question,setQuestion] = useState({
        isMCQ: false,
        title: propQuestion?.title,
        content: propQuestion?.content,
        difficulty,
        language: lang,
        code: getInitialCode(lang),
        simpleTest:{
            input: '',
            output: '',
        },
        input: [],
        output: [],
        casesScore: [],
        cases: propQuestion?.cases,
        published
    });

    const [message,setMessage] = useState({
        message: '',
        title: false,
        content: false,
        code: false,
        simpleInput: false,
        simpleOutput: false,
        test: '',
        isTesting: false,
        testResult: false,
        isTestSuccess: false,
        input: false,
        output: false,
        casesScore: false,
    });
    const [valueTab, setValueTab] = useState(0);
    const [open, setOpen] = useState(false);

    const handleChangeTitle = (e) => {
        const {value} = e.target;
        if(value === '')
        {
            setMessage({...message, title: true});
        }
        else 
        {
            setMessage({...message,          
                title: false,
                message: ''
            });
        }
        setQuestion({...question, title: value});

    }

    const handleChangeContent = (event,editor) => {
        const contentText = editor.getData();
        if(contentText === '')
        {
            setMessage({...message, content: true});
        }
        else 
        {
            setMessage({...message,          
                content: false,
                message: ''
            });
        }
        setQuestion({...question, content: contentText});
    }


    const handleChangeDifficulty = (e) => {
        setQuestion({...question, difficulty: Number(e.target.value)});
    }

    const handleChangeLanguague = (e) => {
        setQuestion({...question, 
            language: e.target.value,
            code: getInitialCode(e.target.value)});
        setMessage({...message,          
            code: false,
            message: ''
        });
    }

    const handleOnChangeCode = (newCode) => {
        if(newCode === '')
        {
            setMessage({...message, code: true,});
        }
        else 
        {
            setMessage({...message,          
                code: false,
                message: ''
            });
        }
        setQuestion({...question, code: newCode});
    }
    
    const handleChangeSimpleTest = (e) => {
        const type = e.target.name;
        if (type === 'simpleIn')
        {
            setQuestion({...question, 
                simpleTest: {...question.simpleTest, input: e.target.value}});
            setMessage({...message, 
                test: '',
                simpleInput: false});
        }
        else 
        {
            setQuestion({...question, 
                simpleTest: {...question.simpleTest, output: e.target.value}});
            setMessage({...message, 
                test: '',
                simpleOutput: false});
        }
    };

    const handleTestCode = async () => {
        if(question.code === '')
        {
            setMessage({...message, 
                test: 'Cannot test due to code is empty',
                code: true,
                testResult: true});
            return;
        }
        if(question.simpleTest.input === '')
        {
            setMessage({...message, 
                test: 'Simple input for test case is empty',
                simpleInput: true,
                testResult: true});
            return;
        }
        if(question.simpleTest.output === '')
        {
            setMessage({...message, 
                test: 'Simple output for test case is empty',
                simpleOutput: true});
            return;
        }

        setMessage({...message, 
            simpleInput: false,
            simpleOutput: false,
            test: '',
            isTesting: true});

        
        const result = await test({
            lang: question.language,
            code: question.code,
            testcases: [{
                input: question.simpleTest.input,
                output: question.simpleTest.output,
                score: 0
            }]
        });

        let resultMessage = '';
        let passed = false;
        if(result.failed === 1)
        {
            resultMessage = `Test failed!\nExpected output: ${result.results[0].expected}\nActual output: ${result.results[0].actual}`
        }
        else
        {
            resultMessage = "Test passed";
            passed = true;
        }

        setMessage({...message, 
            test: resultMessage,
            isTesting: false,
            testResult: result.failed === 1,
            isTestSuccess: passed
        })

    }

    const handleChangeTestCaseFiles = (e) => {
        const type = e.target.name;
        if (e.target.files[0] !== undefined) {
          const fileReader = new FileReader();
          fileReader.onload = async (event) => {
            const text = event.target.result;
            const fileData = getFormatResultFromFile(text);

            if (type === 'input') 
            {
                const testCases = getTestCaseFromInputAndOutput(fileData,question.output,question.casesScore);
                setQuestion({...question, input: fileData, cases: testCases});
                setMessage({...message, 
                    input: false,
                    message: ''});
            }
            else if(type === 'output') {
                const testCases = getTestCaseFromInputAndOutput(question.output,fileData,question.casesScore);
                setQuestion({...question, output: fileData, cases: testCases});
                setMessage({...message, 
                    output: false,
                    message: ''});
            }
            else
            {
                const testCases = getTestCaseFromInputAndOutput(question.input,question.output,fileData);
                setQuestion({...question, casesScore: fileData, cases: testCases});
                setMessage({...message, 
                    casesScore: false,
                    message: ''});
            }
          };
          fileReader.readAsText(e.target.files[0]);
        }
    }
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    const handleTickPublished = (event) => {
        setQuestion({...question, published: event.target.checked});
    };
    

    function validate(){
        if(question.title === undefined || question.title === '')
        {
            setMessage({...message, 
                title: true,
                message: 'Problem title must not be empty'});
            return false;
        }
        if(question.content === undefined || question.content === '')
        {
            setMessage({...message, 
                content: true,
                message: 'Problem content must not be empty'});
            return false;
        }
        if(question.code === '')
        {
            setMessage({...message, 
                code: true,
                message: 'Problem code must not be empty'});
            return false;
        }
        if(question.input.length === 0)
        {
            setMessage({...message, 
                input: true,
                message: 'Input file for test cases must be submitted'});
            return false;
        }
        if(question.output.length === 0)
        {
            setMessage({...message, 
                output: true,
                message: 'Output file for test cases must be submitted'});
            return false;
        }
        if(question.casesScore.length === 0)
        {
            setMessage({...message, 
                casesScore: true,
                message: 'Score file for test cases must be submitted'});
            return false;
        }
        // if(!message.isTestSuccess)
        // {
        //     setMessage({...message, message: 'Problem must be tested successfully with a simple test case before submitting'});
        //     return false;
        // }
        return true;
    }


    const handleClickSubmit = (e) => {
        e.preventDefault();
        const valid = validate();

        if(valid)
        {
            const formatedQuestion = {...question};
            delete formatedQuestion.input;
            delete formatedQuestion.output;
            delete formatedQuestion.casesScore;
            onFormSubmit(formatedQuestion);
        }
    }
    return(
        <Grid container direction="row">
            <Grid item lg={displayScrollSpy ? 9 : 12}>
                <form onSubmit={handleClickSubmit}>
                   <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3}>
                        <Box p={2} m={3} id="section-1"> 
                            <Typography variant="h5">* Enter title: </Typography>
                            <TextField
                                name="title"
                                value={question.title}
                                onChange={handleChangeTitle}
                                fullWidth
                                error = {message.title}
                                helperText="Problem title must not be empty"
                                />
                        </Box>        
                        <Box p={2} m={3} id="section-2">
                            <Typography variant="h5">* Enter content: </Typography>
                            <CKEditor
                                editor={ ClassicEditor }
                                data={question.content}
                                onChange={handleChangeContent} />
                            <p style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}} className={message.content ? classes.error : null }>Problem content must not be empty</p>
                        </Box>
                
                        <Box p={2} m={3} id="section-3">
                            <Typography variant="h5">* Choose level of difficulty: </Typography>
                            <NativeSelect 
                                value={question.difficulty}
                                onChange={handleChangeDifficulty}>                             
                                    <option value={0}>Easy</option>
                                    <option value={1}>Medium</option>
                                    <option value={2}>Hard</option>
                            </NativeSelect>
                        </Box>

                        <Box p={2} m={3} id="section-5">
                            <Typography variant="h5">* Choose programming language: </Typography>
                            <NativeSelect
                                value={question.language}
                                onChange={handleChangeLanguague} >                                   
                                    <option value="Csharp">C#</option>                                
                                    <option value="Java">Java</option>                            
                                    <option value="Python">Python</option>
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3} id="section-6">
                        <Box p={2} m={3}>
                            <Typography variant="h5">* Enter code: </Typography>
                            <ul>
                                <li><Typography>Step 1: Write full your code in the coding editor</Typography></li>
                                <li><Typography>Step 2: Enter a simple input and output test case to verify your code</Typography></li>
                                <li><Typography>Step 3: Click Test code button to test your code and input, output</Typography></li>
                            </ul>
                            <CodeEditor language={question.language}  code={question.code} onCodeChange={handleOnChangeCode} width="600" theme="xcode" />
                            <p style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}} className={message.code ? classes.error : null }>Problem code must not be empty</p>
                        </Box>
                        <Box p={2} m={3}>
                            <Typography variant="h5">* Test your code with a simple test case</Typography>
                            <Box m={1}>
                                <TextField multiline
                                    rows={3} 
                                    value={question.simpleTest.input}
                                    label="Enter simple input" 
                                    name="simpleIn" 
                                    onChange={handleChangeSimpleTest}
                                    variant="outlined" 
                                    error={message.simpleInput}
                                    />
                                <TextField multiline
                                    rows={3} 
                                    value={question.simpleTest.output}
                                    label="Enter simple output" 
                                    name="simpleOut" 
                                    onChange={handleChangeSimpleTest} 
                                    variant="outlined" 
                                    error={message.simpleOutput}
                                    />
                               
                            </Box>
                            {
                                message.isTesting ?
                                <Box m={1}>
                                    <LinearProgress style={{width : 409.34}} />
                                </Box> : null 
                            }
                            <Box m={1}>
                                <Button color="primary" variant="outlined" onClick={handleTestCode}>Test code</Button>
                            </Box>
                            <Box m={1}>
                                <pre style={{fontSize: "1rem"}} className={clsx({
                                    [classes.textFail] : message.testResult,
                                    [classes.textSuccess] : !message.testResult
                                })}>{message.test}</pre>
                            </Box>
                        </Box>
                    </Box>

                    <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3} id="section-7">
                        <Box p={2} m={3} >
                            <Typography variant="h5">Submit input file: </Typography>
                            <TextField 
                                type="file" 
                                accept=".txt" 
                                name="input" 
                                onChange={handleChangeTestCaseFiles}
                                error={message.input}
                                helperText="Input file for test cases must be submitted"/>
                        </Box>
                        <Box p={2} m={3}>
                            <Typography variant="h5">Submit expected output file: </Typography>
                            <TextField 
                                type="file" 
                                accept=".txt" 
                                name="output" 
                                onChange={handleChangeTestCaseFiles}
                                error={message.output}
                                helperText="Output file for test cases must be submitted"/>

                        </Box>
                        <Box p={2} m={3}>
                            <Typography variant="h5">Submit test cases&apos;s scores file: </Typography>
                            <TextField 
                                type="file" 
                                accept=".txt" 
                                name="score" 
                                onChange={handleChangeTestCaseFiles}
                                error={message.casesScore}
                                helperText="Score file for test cases must be submitted"/>
                        </Box>

                        <Box p={2} m={3}>
                            <Button color="secondary" variant="outlined" onClick={handleClickOpen}>See submitted test cases</Button>
                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="alert-dialog-slide-title">Current test cases</DialogTitle>
                                <DialogContent className={classes.testCasesDialog}>
                                    <DialogContentText id="alert-dialog-slide-description">
                                    {
                                        question.cases  ?
                                            <div className={classes.root}>
                                                <Tabs
                                                    orientation="vertical"
                                                    variant="scrollable"
                                                    value={valueTab}
                                                    onChange={handleChangeTab}
                                                    aria-label="Vertical tabs example"
                                                    className={classes.tabs}
                                                >
                                                    {
                                                        question.cases.map((_,index)=>(
                                                            <Tab 
                                                            label={`Test case ${index+1}`} 
                                                            {...a11yProps(index)} />
                                                        ))
                                                    }
                                                </Tabs>
                                                {
                                                    question.cases.map((item,idx)=>(
                                                        <TabPanel value={valueTab} index={idx}>
                                                            <Typography>Test case {idx+1}:</Typography>
                                                            <pre>{`   {\n     input: ${item.input}\n     output: ${item.output}\n     score: ${item.score}\n   }`}</pre>
                                                        </TabPanel>
                                                    ))
                                                }
                                            </div>
                                        : <Typography>There are no records for list of question</Typography>
                                    }
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" className={classes.whiteBackground} boxShadow={2} p={2} m={3} id="section-8">
                        <FormControlLabel
                            control={<Checkbox checked={question.published} onChange={handleTickPublished} name="checkedA" />}
                            label="Is published?"
                        />
                        <Tooltip title="When you publish, this question will be showed showed in Problemsm, and users can access to solve this problem without permission.">
                            <IconButton aria-label="delete">
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography className={classes.error}>{message.message}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" m={3} id="section-8">
                        <Button color="primary" variant="contained" type="submit">Submit</Button>
                    </Box>
                </form>
            </Grid>
            {
                displayScrollSpy ? 
                <Grid item lg={3}>
                    <div className={classes.displayScrollSpy}>
                        <Typography variant="h6">Content:</Typography>
                        <Scrollspy className={classes.listContentStyle}
                        items={ ['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6', 'section-7', 'section-8'] } currentClassName={classes.isCurrent}>
                            <li className={classes.listItem}><a href="#section-1" className={classes.contentScrollSpy}>Enter title</a></li>
                            <li className={classes.listItem}><a href="#section-2" className={classes.contentScrollSpy}>Enter content</a></li>
                            <li className={classes.listItem}><a href="#section-3" className={classes.contentScrollSpy}>Choose level of difficulty</a></li>
                            <li className={classes.listItem}><a href="#section-4" className={classes.contentScrollSpy}>Enter score</a></li>
                            <li className={classes.listItem}><a href="#section-5" className={classes.contentScrollSpy}>Choose programming language</a></li>
                            <li className={classes.listItem}><a href="#section-6" className={classes.contentScrollSpy}>Enter code and test with a simple cases</a></li>
                            <li className={classes.listItem}><a href="#section-7" className={classes.contentScrollSpy}>Submit input/output files and enter score for each of cases</a></li>
                            <li className={classes.listItem}><a href="#section-8" className={classes.contentScrollSpy}>Submit problem and finish</a></li>
                        </Scrollspy>
                    </div>
                </Grid>
                : null
            }
        </Grid>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
}