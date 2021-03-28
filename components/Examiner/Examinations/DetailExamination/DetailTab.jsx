import { Box, Button, IconButton, makeStyles, Tooltip, Typography, withStyles } from '@material-ui/core';
import dateFormat from 'dateformat';
import HTMLReactParser from 'html-react-parser';
import React from 'react';
import LockIcon from '@material-ui/icons/Lock';
import HelpIcon from '@material-ui/icons/Help';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

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
    }
})

export default function DetailTab({exam})
{
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const classes = useStyle();

    return (
        <>
            <Box display="flex" justifyContent="flex-end">
                <Tooltip title="Update is only available before start time of exam">
                    <IconButton aria-label="delete">
                        <HelpIcon/>
                    </IconButton>
                </Tooltip>
                {
                    Date.parse(exam.startAt) - Date.now() > 0 ?
                    <Button variant="contained" color="secondary" href={`/examiner/examinations/update?id=${exam.id}`}>
                        Update
                
                    </Button>
                    :
                    <Button variant="contained" color="secondary" disabled>
                    Update
                    </Button>

                }
            </Box>
            <Typography variant="h3">
            {exam.isPrivate ? 
                 <Tooltip title="Examination is private">
                    <IconButton aria-label="delete">
                        <LockIcon/>
                    </IconButton>
                 </Tooltip> : null
            }
            {exam.title}
            </Typography>
            <Typography style={{textAlign: "center"}}>
                Examination is 
                {
                    Date.parse(exam.startAt) - Date.now() > 0 ?
                    <span> unpublished</span> 
                    :
                    <span> published</span> 
                }
            </Typography>
            <Typography><b>ID</b>: {exam.id}</Typography>
            <Typography><b>Created at</b>: {
                dateFormat(
                    new Date(exam.createdOn),
                    'HH:MM TT, dd-mmmm-yyyy'
                  )}
            </Typography>
            {
                exam.modifiedAt ?
                <Typography><b>Modified at</b>: {
                    dateFormat(
                        new Date(exam.modifiedAt),
                        'HH:MM TT, dd-mmmm-yyyy'
                      )}
                </Typography> : null
            } 
            {
                HTMLReactParser(exam.content)
            }
            <Typography><b>Password</b>: {exam.password}</Typography>
            <Typography><b>Start at</b>: {
                dateFormat(
                    new Date(exam.startAt),
                    'HH:MM TT, dd-mmmm-yyyy'
                  )}
            </Typography>       
            <Typography><b>End at</b>: {
                dateFormat(
                    new Date(exam.endAt),
                    'HH:MM TT, dd-mmmm-yyyy'
                  )}
            </Typography> 
            <Typography><b>Questions</b>:</Typography> 
            <div>
                {
                    exam.problems.map((value,key)=>(
                    <Accordion square expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
                        <AccordionSummary className={key % 2 !== 0 ? classes.oddColor : null} aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>
                                #{key+1}&nbsp;
                                {
                                    value.isMCQ ?
                                    <span>(Multiple choices)</span>
                                    :
                                    <span>(Coding problem)</span>
                                }
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                value.isMCQ ?
                                <div>
                                    {
                                        HTMLReactParser(value.question)
                                    }
                                    <ul>
                                        <li>
                                        {
                                            HTMLReactParser(value.a)
                                        }
                                        </li>
                                        <li>
                                        {
                                            HTMLReactParser(value.b)
                                        }
                                        </li>
                                        <li>
                                        {
                                            HTMLReactParser(value.c)
                                        }
                                        </li>
                                        <li>
                                        {
                                            HTMLReactParser(value.d)
                                        }
                                        </li>
                                    </ul>
                                    <Typography><b>Correct</b>: {value.correct}</Typography>
                                    <Typography><b>Difficulty</b>: {value.difficulty}</Typography>
                                    <Typography><b>Score</b>: {value.score}</Typography>
                                    <Typography><b>Time</b>: {value.minutes}m {value.seconds}s</Typography>
                                </div>
                                :
                                <div>
                                    {
                                        HTMLReactParser(value.title)
                                    }
                                    {
                                        HTMLReactParser(value.content)
                                    }
                                    <code><pre>{value.code}</pre></code>
                                    <Typography><b>Difficulty</b>: {value.difficulty}</Typography>
                                    <Typography><b>Score</b>: {value.score}</Typography>
                                    <Typography><b>Time</b>: {value.minutes}m {value.seconds}s</Typography>
                                </div>
                            }
                        </AccordionDetails>
                     </Accordion>
                    ))
                }
            </div>      
        </>
    )
}