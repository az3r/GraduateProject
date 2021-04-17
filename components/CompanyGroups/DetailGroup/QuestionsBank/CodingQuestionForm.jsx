import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CodeEditor from '@components/CodeEditor';
import getTestCaseFromInputAndOutput, { getFormatResultFromFile, getInitialCode } from '@libs/client/business';
import { Box, Button, Grid, makeStyles, NativeSelect, Slide, TextField, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import Scrollspy from 'react-scrollspy';


const useStyles = makeStyles({
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
            fontSize: "18px"
          }
    },
    contentScrollSpy: {
        color: "#000000",
        fontSize: "16px",
        wordWrap: "break-word",
        textDecoration: 'none'
    },
    listContentStyle : {
        listStyle: "none",
    },
    listItem: {
        marginBottom: "10px"
    }
  });

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function CodingQuestionForm({onFormSubmit, propQuestion, displayScrollSpy})
{
    const lang = propQuestion !== null ? propQuestion.language : "Csharp";
    const difficulty = propQuestion !== null ? propQuestion.difficulty : 0;

    const classes = useStyles();
    const [question,setQuestion] = useState({
        isMCQ: false,
        title: propQuestion?.title,
        content: propQuestion?.content,
        difficulty,
        score: propQuestion?.score,
        language: lang,
        code: getInitialCode(lang),
        input: [],
        simpleInput: '',
        output: [],
        simpleOutput: '',
        cases: propQuestion?.cases,
    });

    // const [message,setMessage] = useState({
    //     testCodeSuccess: false,
    //     isLoadingTestCode: false,
    //     message:{
    //         title: false,
    //         content: false,
    //         score: false,
    //         code: false,
    //         input: false,
    //         output: false,}
    // });

    const [open, setOpen] = useState(false);

    const handleChangeTitle = (e) => {
        setQuestion({...question, title: e.target.value});
    }

    const handleChangeContent = (event,editor) => {
        const contentText = editor.getData();
        setQuestion({...question, content: contentText});
    }

    const handleChangeScore = (e) => {
        setQuestion({...question, score: Number(e.target.value)});
    };

    const handleChangeDifficulty = (e) => {
        setQuestion({...question, difficulty: Number(e.target.value)});
    }

    const handleChangeLanguague = (e) => {
        setQuestion({...question, 
            language: e.target.value,
            code: getInitialCode(e.target.value)});
    }

    const handleOnChangeCode = (newCode) => {
        setQuestion({...question, code: newCode});
    }
    
    const handleChangeSimpleTest = (e) => {
        const type = e.target.name;
        if (type === 'simpleIn')
        {
            setQuestion({...question, simpleInput: e.target.value});
        }
        else setQuestion({...question, simpleOutput: e.target.value});
    };

    const handleTestCode = () => {
        console.log(question);
    }

    const handleChangeTestCaseFiles = (e) => {
        const type = e.target.name;
        if (e.target.files[0] !== undefined) {
          const fileReader = new FileReader();
          fileReader.onload = async (event) => {
            const text = event.target.result;
            const testCases = getFormatResultFromFile(text);

            if (type === 'input') setQuestion({...question, input: testCases});

            else setQuestion({...question, output: testCases});
          };
          fileReader.readAsText(e.target.files[0]);
        }
    }
    
    const handleClickOpen = () => {
        const testCases = getTestCaseFromInputAndOutput(question.input,question.output);
        setQuestion({...question, cases: testCases});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    


    const handleClickSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(question);
    }
    return(
        <Grid container direction="row">
            <Grid item lg={displayScrollSpy ? 9 : 12}>
                <form onSubmit={handleClickSubmit}>
                   <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3}>
                        <Box p={2} m={3} id="section-1"> 
                            <Typography variant="h5">Enter title: </Typography>
                            <TextField
                                name="title"
                                value={question.title}
                                onChange={handleChangeTitle}
                                fullWidth/>
                        </Box>        
                        <Box p={2} m={3} id="section-2">
                            <Typography variant="h5">Enter information: </Typography>
                            <CKEditor
                                editor={ ClassicEditor }
                                data={question.content}
                                onChange={handleChangeContent} />
                        </Box>
                
                        <Box p={2} m={3} id="section-3">
                            <Typography variant="h5">Choose level of difficulty: </Typography>
                            <NativeSelect name="difficulty" onChange={handleChangeDifficulty}>
                                {
                                    question.difficulty === 0 ?
                                    <option value={0} selected >Easy</option>
                                    :
                                    <option value={0}>Easy</option>
                                }
                                {
                                    question && question.difficulty === 1 ?
                                    <option value={1} selected>Medium</option>
                                    :
                                    <option value={1}>Medium</option>
                                }
                                {
                                    question && question.difficulty === 2 ?
                                    <option value={2} selected>Hard</option>
                                    :
                                    <option value={2}>Hard</option>
                                }
                            </NativeSelect>
                        </Box>
        
                        <Box p={2} m={3} id="section-4">
                            <Typography variant="h5">Enter score: </Typography>
                            <input name= "score" type="number" max="100" min="0" value={question.score} onChange={handleChangeScore} />
                        </Box>

                        <Box p={2} m={3} id="section-5">
                            <Typography variant="h5">Choose programming language: </Typography>
                            <NativeSelect
                                onChange={handleChangeLanguague} >
                                    {
                                        question?.language === "Csharp" ?
                                        <option selected value="Csharp">C#</option>
                                        :
                                        <option value="Csharp">C#</option>
                                    }
                                    {
                                        question?.language === "Java" ?
                                        <option selected value="Java">Java</option>
                                        :
                                        <option value="Java">Java</option>
                                    }
                                    {
                                        question?.language === "Python" ?
                                        <option selected value="Python">Python</option>
                                        :
                                        <option value="Python">Python</option>
                                    }
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3} id="section-6">
                        <Box p={2} m={3}>
                                <Typography variant="h5">Enter code: </Typography>
                                <CodeEditor language={question.language}  code={question.code} onCodeChange={handleOnChangeCode} width="600" theme="xcode" />
                        </Box>
                        <Box p={2} m={3}>
                            <Typography variant="h5">Notes:</Typography>
                            <ul>
                                <li><Typography>Write full your code in the coding editor</Typography></li>
                                <li><Typography>Enter simple input and output to test your code (include only one test case)</Typography></li>
                                <li><Typography>Click Test code button to test your code and input, output</Typography></li>
                            </ul>

                            <div>
                                <TextField multiline label="Enter simple input" name="simpleIn" onChange={handleChangeSimpleTest} />
                            </div>
                            <div>
                                <TextField multiline label="Enter simple output" name="simpleOut" onChange={handleChangeSimpleTest} />
                            </div>
                            <br />
                            <div>
                                <Button color="secondary" variant="outlined" onClick={handleTestCode}>Test code</Button>
                                {/* <SkewLoader color="#088247"  loading={value.isLoadingTestCode} size={20} /> */}
                            </div>
                            <pre className={[question.testCodeSuccess ? classes.textSuccess : classes.textFail,classes.testFont].join(" ")}>{question.messageTestCode}</pre>
                        </Box>
                    </Box>

                    <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3} id="section-7">
                        <Box p={2} m={3} >
                            <Typography variant="h5">Submit input file: </Typography>
                            <input type="file" name="input" onChange={handleChangeTestCaseFiles} />                            
                        </Box>
                        <Box p={2} m={3}>
                            <Typography variant="h5">Submit expected output file: </Typography>
                            <input type="file" name="output" onChange={handleChangeTestCaseFiles} />
                        </Box>

                        <Box p={2} m={3}>
                            <Button color="secondary" variant="outlined" onClick={handleClickOpen}>See submitted test cases</Button>
                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="alert-dialog-slide-title">Current test cases</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                    {question.cases?.map((item,key)=>(
                                        <Typography key ><b>#{key+1}:</b> input: {item.input} / output: {item.output}</Typography>
                                    ))}
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

                    <Box display="flex" justifyContent="center" p={2} m={3} id="section-8">
                        <Button color="primary" variant="contained" type="submit">Submit</Button>
                    </Box>
                </form>
            </Grid>
            {
                displayScrollSpy ? 
                <Grid item lg={3}>
                    <div className={classes.displayScrollSpy}>
                        <Typography variant="h5">Content:</Typography>
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