import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Drawer, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import React, { useState } from 'react';
import Scrollspy from 'react-scrollspy';
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
    danger:{

    }
  }));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function EditExamination({examProp}){
    const classes= useStyles();
    const [exam,setExam] = useState({
        title: examProp?.title,
        content: examProp?.content,
        password: examProp?.password,
        published: examProp?.published,
        duration: examProp?.duration,
        start: examProp?.start,
        end: examProp?.end,
        questions: []
    })
    const [openDrawer, setOpenDrawer] = useState(false);
    const [value, setValue] = useState(0);
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
        setExam({...exam, questions: newListQuestion})
    }

    return(
        <Grid container direction="row">
            <Grid item lg={9}>
                <Box m={3} p={2} boxShadow={2} className={classes.whiteBackground}>
                    <Box m={3} p={2} display="flex" justifyContent="center">
                        <Typography color="secondary" variant="h4">GENERAL INFORMATION SECTION</Typography>
                    </Box>
                    <Box m={3} p={2} id="section-20">
                        <Typography variant="h5">* Enter title:</Typography>
                        <TextField fullWidth/>
                    </Box>
                    <Box p={2} m={3} id="section-21">
                        <Typography variant="h5">* Enter content: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                        />
                    </Box>
                    <Box m={3} p={2} id="section-22">
                        <Typography variant="h5">Enter password:</Typography>
                        <TextField type="password" fullWidth/>
                    </Box>
                    <Box m={3} p={2} id="section-23">
                        <Typography variant="h5">* Enter duration:</Typography>
                        <Box display="flex">
                            <input type="number" max="100" min="0" value={Math.floor(exam.duration / 60)}/>
                            <Typography>&nbsp;minute(s)&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;</Typography>
                            <input type="number" max="59" min="0" value={exam.duration % 60}/>
                            <Typography>&nbsp;second(s)&nbsp;&nbsp;</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box boxShadow={2} m={3} p={2} id="section-24" className={classes.whiteBackground}>
                    <Box m={3} p={2} display="flex" justifyContent="center">
                        <Typography color="secondary" variant="h4">QUESTIONS SECTION</Typography>
                    </Box>
                    <Box m={3} p={2}>
                        <Button style={{display: "block", margin: "0 auto 20px auto"}} color="primary" variant="outlined" onClick={toggleDrawer(true)}>Add question from library</Button>
                        <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
                            <AddProblemFromLibrary questionsList={exam.questions} handleAddQuestionFromLibrary={handleAddQuestionFromLibrary} />
                        </Drawer>
                        <Button style={{display: "block", margin: "20px auto 20px auto"}} variant="outlined" color="primary" onClick={handleClickOpen}>
                            Add new question
                        </Button>
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
                                    value={value}
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
                                        <TabPanel value={value} index={idx}>
                                            <Button className={classes.danger} onClick={() => handleDeleteQuestion(idx)} startIcon={<DeleteIcon />}>Delete question</Button>
                                            {item.title}
                                        </TabPanel>
                                    ))
                                }
                            </div>
                        : <Typography>There are no records for list of question</Typography>
                    }
                </Box>
            </Grid>
            <Grid item lg={3}>
                <div className={classes.displayScrollSpy}>
                    <Typography variant="h5">Content:</Typography>
                    <Scrollspy className={classes.listContentStyle}
                    items={ ['section-20', 'section-21', 'section-22', 'section-23', 'section-24'] } currentClassName={classes.isCurrent}>
                        <li className={classes.listItem}><a href="#section-20" className={classes.contentScrollSpy}>Enter title</a></li>
                        <li className={classes.listItem}><a href="#section-21" className={classes.contentScrollSpy}>Enter content</a></li>
                        <li className={classes.listItem}><a href="#section-22" className={classes.contentScrollSpy}>Enter password</a></li>
                        <li className={classes.listItem}><a href="#section-23" className={classes.contentScrollSpy}>Enter duration</a></li>
                        <li className={classes.listItem}><a href="#section-24" className={classes.contentScrollSpy}>Add questions</a></li>
                    </Scrollspy>
                </div>
            </Grid>
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