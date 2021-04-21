import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Drawer, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddProblemFromLibrary from './AddProblemFromLibrary';
import NewQuestionForExamination from './NewQuestionForExamination';



const useStyles = makeStyles((theme) => ({
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

    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
    flex: 1,
    },
    list: {
        width: 500,
    },
    fullList: {
        width: 'auto',
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 500,
      },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    error:{
        color: 'red !important'
    }
  }));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function EditExamination({examProp}){
    const classes= useStyles();
    const published =  examProp?.published || false;
    const duration = examProp?.duration || 0;
    const questions = examProp?.problems || [];
    const [exam,setExam] = useState({
        title: examProp?.title,
        content: examProp?.content,
        password: examProp?.password,
        published,
        duration,
        start: examProp?.start,
        end: examProp?.end,
        questions
    })
    const [message,setMessage] = useState({
        message: '',
        title: false,
        content: false,
    })
    const [openDrawer, setOpenDrawer] = useState(false);
    const [valueTab, setValue] = useState(0);
    const [open, setOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toggleDrawer = (o) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setOpenDrawer(o);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTitle = (e) => {
        const {value} = e.target;
        if(value === '')
        {
            setMessage({...message, title: true});
        }
        else
        {
            setMessage({...message, title: false, message: ''});
        }
        setExam({...exam, title: value});
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
        setExam({...exam, content: contentText});
    }

    const handleChangeMinutes = (e) => {
        const {value} = e.target;
        if(Number(value) < 0 || Number(value) > 100) return;
        const currentDuration = exam.duration;
        const currentSeconds = currentDuration % 60;
        setExam({...exam, duration: Number(value)* 60 + currentSeconds });
        setMessage({...message,          
            duration: false,
            message: ''
        });
    }
    
    const handleChangeSeconds = (e) => {
        const {value} = e.target;
        if(Number(value) < 0 || Number(value) > 100) return;
        const currentDuration = exam.duration;
        const currentMinutes = Math.floor(currentDuration / 60);
        setExam({...exam, duration: currentMinutes* 60 + Number(value) });
        setMessage({...message,          
            duration: false,
            message: ''
        });
    }
    

    const handleAddQuestionFromLibrary = (idProblem) =>{
        setExam({...exam, questions: [...exam.questions, idProblem]});
    }

    const onAddQuestion = (question, isSaved) => {
        if(isSaved)
        {
            // save to library
            const idProblem = 1;
            setExam({...exam, questions: [...exam.questions, idProblem]});
        }
        else
        {
            setExam({...exam, questions: [...exam.questions, question]});
        }
    }

    const handleDeleteQuestion = (index) => {
        const newListQuestion = [...exam.questions];
        newListQuestion.splice(index,1);
        setExam({...exam, questions: newListQuestion});
    }

    function validate(){
        if(exam.title === undefined || exam.title === '')
        {
            setMessage({...message, title: true, message: "Examination title must not be empty"});
            return false;
        }
        if(exam.content === undefined || exam.content === '')
        {
            setMessage({...message, content: true, message: "Examination content must not be empty"});
            return false;
        }
        if(exam.duration === 0)
        {
            setMessage({...message, duration: true, message: "Examination duration must not be empty"});
            return false;
        }
        if(exam.questions.length === 0)
        {
            setMessage({...message, message: "List of questions must not be empty"});
            return false;
        }
        return false;
    }

    const handleSubmitForm = () => {
        const valid = validate();
        if(valid)
        {
            // TODO
            // return exam obj
        }
    }

    return(
        <Box>
            <Box m={3} p={2} boxShadow={2} className={classes.whiteBackground}>
                <Box m={3} p={2} display="flex" justifyContent="center">
                    <Typography color="secondary" variant="h4">GENERAL INFORMATION SECTION</Typography>
                </Box>
                <Box m={3} p={2} id="section-20">
                    <Typography variant="h5">* Enter title:</Typography>
                    <TextField fullWidth
                        value={exam.title}
                        onChange={handleChangeTitle}
                        error={message.title}
                        helperText="Examination title must not be empty"/>
                </Box>
                <Box p={2} m={3} id="section-21">
                    <Typography variant="h5">* Enter content: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        onChange={handleChangeContent}
                    />
                    <p style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}} className={message.content ? classes.error : null }>Examination content must not be empty</p>
                </Box>
                <Box m={3} p={2} id="section-22">
                    <Typography variant="h5">Enter password:</Typography>
                    <TextField type="password" fullWidth/>
                </Box>
                <Box m={3} p={2} id="section-23">
                    <Typography variant="h5">* Enter duration:</Typography>
                    <Box display="flex">
                        <TextField 
                            type="number" 
                            value={Math.floor(exam.duration / 60)}
                            InputProps={{inputProps: {
                                min: 0,
                                max: 100
                            }}}
                            onChange={handleChangeMinutes}/>
                        <Typography>&nbsp;minute(s)&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;</Typography>
                        <TextField 
                            type="number" 
                            value={exam.duration % 60}
                            InputProps={{inputProps: {
                                min: 0,
                                max: 59
                            }}}
                            onChange={handleChangeSeconds}/>
                        <Typography>&nbsp;second(s)&nbsp;&nbsp;</Typography>
                    </Box>
                    <p style={{fontSize: "0.75rem", color: 'rgba(0, 0, 0, 0.54)'}} className={message.duration ? classes.error : null }>Examination duration must be &gt; 0 second</p>
                </Box>
            </Box>
            <Box boxShadow={2} m={3} p={2} id="section-24" className={classes.whiteBackground}>
                <Box m={3} p={2} display="flex" justifyContent="center">
                    <Typography color="secondary" variant="h4">QUESTIONS SECTION</Typography>
                </Box>
                <Box m={3} p={2}>
                    <Button style={{display: "block", margin: "0 auto 20px auto"}} color="primary" variant="outlined" onClick={toggleDrawer(true)}>Add question from library</Button>
                    <Typography style={{textAlign: "center"}}>or</Typography>
                    <Button style={{display: "block", margin: "20px auto 20px auto"}} variant="outlined" color="primary" onClick={handleClickOpen}>
                        Add new question
                    </Button>
                    <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
                        <AddProblemFromLibrary questionsList={exam.questions} handleAddQuestionFromLibrary={handleAddQuestionFromLibrary} />
                    </Drawer>
                    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar} color="secondary">
                            <Toolbar>
                                <Typography variant="h6" className={classes.title}>
                                    Add/Edit question for examination
                                </Typography>
                                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <NewQuestionForExamination onFormSubmit={onAddQuestion} />
                    </Dialog> 
                </Box>
                {
                    exam.questions.length > 0 ?
                        <div className={classes.root}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={valueTab}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                className={classes.tabs}
                            >
                                {
                                    exam.questions.map((item,index)=>(
                                        <Tab 
                                        label={item.isMCQ ? `${index+1}. Multiple choice` : `${index+1}. Coding question`} 
                                        {...a11yProps(index)} />
                                    ))
                                }
                            </Tabs>

                            {
                                exam.questions.map((item,idx)=>(
                                    <TabPanel value={valueTab} index={idx}>
                                        <Button className={classes.danger} onClick={() => handleDeleteQuestion(idx)} startIcon={<DeleteIcon />}>Delete question</Button>
                                        {item.title}
                                    </TabPanel>
                                ))
                            }
                        </div>
                    : <Typography>There are no records for list of questions</Typography>
                }
            </Box>
            <Box display="flex" justifyContent="center">
                <Typography className={classes.error}>{message.message}</Typography>
            </Box>
            <Box display="flex" justifyContent="center" m={3}>
                <Button variant="contained" color="primary" onClick={handleSubmitForm}>Submit</Button>
            </Box>
        </Box>
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