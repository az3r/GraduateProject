import { get } from '@libs/client/problems';
import { Box, Button, Divider, makeStyles, Slide, Typography } from '@material-ui/core';
import HTMLReactParser from 'html-react-parser';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getDifficultyString } from '@libs/client/business';

const useStyles = makeStyles((theme)=>({
    testCasesDialog:{
        width: 500,
        height: 300
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 270,
    },
}));

export default function QuestionInfo({question})
{
    const [problem,setProblem] = useState({});
    const [loading,setLoading] = useState(true);
    useEffect(async ()=>{
        if(question.id)
        {
            const problemData = await get({
                problemId: question.id,
            });
            setProblem(problemData);
        }
        else setProblem(question)
        setLoading(false);
    },[question]);

    return(
        <Box>
            {
                loading ? 
                <CircularProgress />
                : 
                <ShowInfoQuestionMCQ problem={problem}/>
            }
        </Box>
    );
}

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function ShowInfoQuestionMCQ({problem})
{
    const [valueTab, setValueTab] = useState(0);
    const [open, setOpen] = useState(false);
    const classes = useStyles();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    return(
        <div>
            <Typography>Difficulty: {getDifficultyString(problem.difficulty)}</Typography>
            <Typography>Score: {problem.score}</Typography>
            {
                !problem.isMCQ ?
                <Typography>Language: {problem.language}</Typography> : null
            }
            <Divider/>
            {
                problem.isMCQ ?
                <>
                    {
                        HTMLReactParser(problem.title)
                    }
                    <ol type="A">
                        <li>
                            {HTMLReactParser(problem.answers.A)}
                        </li>
                        <li>
                            {HTMLReactParser(problem.answers.B)}
                        </li>
                        <li>
                            {HTMLReactParser(problem.answers.C)}
                        </li>
                        <li>
                            {HTMLReactParser(problem.answers.D)}
                        </li>
                    </ol>
                    <Typography>Correct: {HTMLReactParser(problem.correctIndices)}</Typography>
                </>
                :
                <>
                    <Typography>{problem.title}</Typography>
                    {HTMLReactParser(problem.content)}
                    <code>
                        <pre>
                            {problem.code}
                        </pre>
                    </code>
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
                                            problem.cases.map((_,index)=>(
                                                <Tab 
                                                label={`Test case ${index+1}`} 
                                                {...a11yProps(index)} />
                                            ))
                                        }
                                    </Tabs>
                                    {
                                        problem.cases.map((item,idx)=>(
                                            <TabPanel value={valueTab} index={idx}>
                                                <Typography>Test case {idx+1}:</Typography>
                                                <pre>{`   {\n     input: ${item.input}\n     output: ${item.output}\n     score: ${item.score}\n   }`}</pre>
                                            </TabPanel>
                                        ))
                                    }
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </div>
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