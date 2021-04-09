import { Avatar, Box, Breadcrumbs, Chip, IconButton, Link, makeStyles, Tooltip, Typography, withStyles } from '@material-ui/core';
import dateFormat from 'dateformat';
import React from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import HTMLReactParser from 'html-react-parser';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const Accordion = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);
  
const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
        minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
        margin: '12px 0',
        },
    },
    expanded: {},
    })(MuiAccordionSummary);

    const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
},
}))(MuiAccordionDetails);

const useStyle = makeStyles({
    oddColor:{
        backgroundColor: '#e9e9e9',
    },
    centerText:{
        textAlign: 'center',
    },
    avatar: {
        width: "70px",
        height: "70px"
    },
    spacing:{
        marginBottom: '30px'
    },
    centerPage:{
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    examineeTable:{
        width: "50%",
        border: '1px solid black',
        borderCollapse: 'collapse',
        textAlign: 'left',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '5px',
        paddingRight: '5px',
    },
    displayFlex:{
        display: "flex"
    },
    correct:{
        color: 'green',
    },
    incorrect:{
        color: 'red',
    },
    codeContainer:{
        paddingLeft: '10px',
        paddingTop: '5px',
        paddingRight: '5px',
        paddingBottom: '5px',
        borderLeft: "5px solid #e5e5e5",
        marginBottom: "10px"
    },
    case: {
        marginRight: "10px"
    },
    passCase:{
        backgroundColor: "green",
        color: "white"
    },
    failCase:{
        backgroundColor: "red",
        color: "white"
    }
})

export default function ResultPage({examinee,result})
{
    const [expanded, setExpanded] = React.useState('');
    const classes = useStyle();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return(
        <Box m={1} p={2}>
            <div>
                <Breadcrumbs>
                    <Link color="inherit" href="/examiner">
                        Examiner
                    </Link>
                    <Link color="inherit" href="/examiner/examinations">
                        Examinations
                    </Link>
                    <Link color="inherit"  href={`/examiner/examinations/detail?id=${result.examId}`}>
                        Detail
                    </Link>
                    <Typography color="textPrimary">Result</Typography>
                </Breadcrumbs>
            </div>
            <Box m={3} p={2} boxShadow={1}>
                <Typography variant="h4" className={[classes.centerText,classes.spacing].join(' ')}>Examination Result Report</Typography>
                <Avatar className={[classes.avatar,classes.centerPage,classes.spacing].join(' ')} alt="Remy Sharp" src={examinee.avatar}/>
                <table className={[classes.examineeTable,classes.centerPage,classes.spacing].join(' ')}>
                    <tr>
                        <th className={classes.examineeTable}>Name:</th>
                        <td className={classes.examineeTable}><Typography>{examinee.name}</Typography></td>
                    </tr>
                    <tr>
                        <th className={classes.examineeTable}>Email:</th>
                        <td className={classes.examineeTable}><Typography>{examinee.email}</Typography></td>
                    </tr>
                    <tr>
                        <th className={classes.examineeTable}>Examination ID:</th>
                        <td className={classes.examineeTable}><Typography>{result.examId}</Typography></td>
                    </tr>
                    <tr>
                        <th className={classes.examineeTable}>Total questions:</th>
                        <td className={classes.examineeTable}><Typography>{result.total}</Typography></td>
                    </tr>
                    <tr>
                        <th className={classes.examineeTable}>Total correct answers:</th>
                        <td className={classes.examineeTable}><Typography>{result.correct}</Typography></td>
                    </tr>
                    <tr>
                        <th className={classes.examineeTable}>Submitted at:</th>
                        <td className={classes.examineeTable}><Typography>{dateFormat(
                                new Date(result.createdOn),
                                'HH:MM TT, dd-mmmm-yyyy'
                            )}</Typography></td>
                    </tr>
                </table>

                <div>
                {
                    result.results.map((value,key)=>(
                    <Accordion square expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
                        <AccordionSummary className={key % 2 !== 0 ? classes.oddColor : null} aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>
                                #{key+1}&nbsp;
                                {
                                    value.isMCQ ?
                                    <span>
                                        (Multiple choices)
                                        {
                                                value.status ?
                                                <Tooltip title="Correct">
                                                    <IconButton className={classes.correct}>
                                                        <CheckIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                <Tooltip title="Incorrect">
                                                    <IconButton className={classes.incorrect}>
                                                        <CloseIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                    </span>
                                    :
                                    <span>
                                        (Coding problem)
                                        {
                                            value.status === "Accepted" ?
                                            <Tooltip title="Correct">
                                                <IconButton className={classes.correct}>
                                                    <CheckIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Incorrect">
                                                <IconButton className={classes.incorrect}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </span>
                                }
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                value.isMCQ ?
                                <div>
                                    <div className={classes.displayFlex}>
                                        <p><b>Problem name:&nbsp;</b></p>
                                        {
                                            HTMLReactParser(value.problemName)
                                        }
                                    </div>
                                        <p><b>Status:</b> {value.status ? "Correct" : "Incorrect"}</p>
                                        <p><b>Correct answer:</b> {value.details.correctAnswer}</p>                                     
                                        <p><b>Selected answer:</b> {value.details.selectedAnswer}</p>
                                </div>
                                :
                                <div>
                                    <div>
                                        <div className={classes.displayFlex}>
                                            <p><b>Problem name: </b>{value.problemName}</p>
                                        </div>
                                        <pro><b>Status:</b> {value.status}</pro>
                                        <p><b>Answer:</b></p>
                                        <div className={classes.codeContainer}>
                                            <code>
                                                <pre>{value.details.code}</pre>
                                            </code>
                                        </div>
                                        <p><b>Test cases:</b></p>
                                        <ul>
                                            <li>Passed: {value.details.passed}</li>
                                            <li>Failed: {value.details.failed}</li>
                                        </ul>
                                        <Box display="flex" flexWrap="wrap"> 
                                        {
                                           
                                            value.details.results.map((testCase,k)=>(
                                                <Chip label={`Test case ${k+1}`} className={[testCase.passed ? classes.passCase : classes.failCase, classes.case].join(" ")}/>
                                            ))
                                        }
                                        </Box>
                                    </div>
                                </div>
                            }
                        </AccordionDetails>
                     </Accordion>
                    ))
                }
            </div>      
            </Box>
        </Box>
    );
}