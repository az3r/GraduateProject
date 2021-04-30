import CodeEditor from '@components/CodeEditor';
import { getDifficultyString } from '@libs/client/business';
import { Box, Breadcrumbs, Button, Divider, Grid, InputBase, makeStyles, MenuItem, Select, Slide, Typography, withStyles } from '@material-ui/core';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React, { useState } from 'react'

const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);


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
    error: {
        color: 'red !important'
    },
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
    tabContent: {
        width: '65%', 
        overflow: 'scroll',
        overflowX: 'hidden'
      }
}));


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function DetailQuestion({user, problemProp})
{
    const [theme, setTheme] = useState('xcode');
    const [size, setSize] = useState(14);
    const [valueTab, setValueTab] = useState(0);
    const [open, setOpen] = useState(false);
    const classes = useStyles();
  
    const router = useRouter();
    const {id, question} = router.query;

    const handleSizeChange = (event) => {
        setSize(event.target.value);
      };
    
    const handleThemeChange = (event) => {
    setTheme(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    return (
        <Box m={3}>
            <Breadcrumbs>
                <Link href="/company-groups">
                    Company groups
                </Link>
                <Link href={`/company-groups/${id}`}>
                    Current group
                </Link>
                <Link href={`/company-groups/${id}/questions-bank`}>
                    Questions bank
                </Link>
                <Typography color="textPrimary">Detail</Typography>
            </Breadcrumbs>
            <Divider/>
            <Grid container>
                <Grid item lg={6} md={6} sm={12} xs={12} style={{wordWrap: 'break-word'}}>
                    <Box display="flex" justifyContent="flex-end" m={1}>
                        <Link href={`/company-groups/${id}/questions-bank/update?question=${question}`}><Button variant="outlined" disabled={problemProp.owner !== user.id}>Edit question</Button></Link>
                    </Box>
                    {
                        problemProp.isMCQ ?
                        <>
                            {HTMLReactParser(problemProp.title)}
                        </>
                        :
                        <>
                            <Typography>{problemProp.title}</Typography>
                            {HTMLReactParser(problemProp.content)}
                        </>
                    }
                    <Typography><b>Difficult:</b> {getDifficultyString(problemProp.difficulty)}</Typography>
                    <Typography><b>Score:</b> {problemProp.score}</Typography>
                    {
                        problemProp.isMCQ ?
                        null
                        :
                        <Box display="flex" justifyContent="center" m={1}>
                            <Button color="secondary" variant="outlined" onClick={handleClickOpen}>See test cases</Button>
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
                                        problemProp.cases.length !== 0  ?
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
                                                        problemProp.cases.map((_,index)=>(
                                                            <Tab 
                                                                label={`Test case ${index+1}`} 
                                                            />
                                                        ))
                                                    }
                                                </Tabs>
                                                {
                                                    problemProp.cases.map((item,idx)=>(
                                                        <TabPanel value={valueTab} index={idx}>
                                                            <Typography>Test case {idx+1}:</Typography>
                                                            <div style={{wordWrap: 'break-word'}}>
                                                                <Typography>{`{`}</Typography>
                                                                <Typography>&nbsp;&nbsp;&nbsp;&nbsp;<b>input:</b> {item.input},</Typography>
                                                                <Typography>&nbsp;&nbsp;&nbsp;&nbsp;<b>output:</b> {item.output},</Typography>
                                                                <Typography>&nbsp;&nbsp;&nbsp;&nbsp;<b>score:</b> {item.score}</Typography>
                                                                <Typography>{`}`}</Typography>
                                                        </div>
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
                    }
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} style={{wordWrap: 'break-word'}}>
                    {
                        problemProp.isMCQ ?
                        <>
                            <ol type="A">
                                <li>{HTMLReactParser(problemProp.answers.A)}</li>
                                <li>{HTMLReactParser(problemProp.answers.B)}</li>
                                <li>{HTMLReactParser(problemProp.answers.C)}</li>
                                <li>{HTMLReactParser(problemProp.answers.D)}</li>
                            </ol>
                            <Typography>Correct: {HTMLReactParser(problemProp.correctIndices)}</Typography>
                        </>
                        :
                        <>
                            <Box display="flex" justifyContent="flex-end" m={1}>
                                <Select
                                style={{minWidth: 50, marginRight: 20}}
                                value={size}
                                onChange={handleSizeChange}
                                input={<BootstrapInput />}
                                >
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={32}>32</MenuItem>
                                <MenuItem value={40}>40</MenuItem>
                                </Select>
                                <Select
                                    style={{minWidth: 150}}
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={theme}
                                    onChange={handleThemeChange}
                                    input={<BootstrapInput />}
                                >
                                    <MenuItem value="xcode">Xcode</MenuItem>
                                    <MenuItem value="monokai">Monokai</MenuItem>
                                    <MenuItem value="github">Github</MenuItem>
                                    <MenuItem value="tomorrow">Tomorrow</MenuItem>
                                    <MenuItem value="kuroir">Kuroir</MenuItem>
                                    <MenuItem value="solarized_dark">Solarized Dark</MenuItem>
                                    <MenuItem value="textmate">Textmate</MenuItem>
                                    <MenuItem value="solarized_light">Solarized Light</MenuItem>
                                    <MenuItem value="terminal">Terminal</MenuItem>
                                    <MenuItem value="twilight">Twilight</MenuItem>
                                </Select>
                            </Box>
                            <CodeEditor
                                language={problemProp.language}
                                code={problemProp.code}
                                width="100%"
                                height={450}
                                size={size}
                                theme={theme}
                                />
                        </>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        className={classes.tabContent}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
}