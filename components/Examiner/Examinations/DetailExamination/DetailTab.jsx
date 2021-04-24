// import { Box, Button, IconButton, makeStyles, Step, StepLabel, Stepper, Tooltip, Typography, withStyles } from '@material-ui/core';
// import dateFormat from 'dateformat';
// import HTMLReactParser from 'html-react-parser';
// import React from 'react';
// import LockIcon from '@material-ui/icons/Lock';
// import HelpIcon from '@material-ui/icons/Help';
// import MuiAccordion from '@material-ui/core/Accordion';
// import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
// import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

// const Accordion = withStyles({
//     root: {
//       border: '1px solid rgba(0, 0, 0, .125)',
//       boxShadow: 'none',
//       '&:not(:last-child)': {
//         borderBottom: 0,
//       },
//       '&:before': {
//         display: 'none',
//       },
//       '&$expanded': {
//         margin: 'auto',
//       },
//     },
//     expanded: {},
//   })(MuiAccordion);
  
// const AccordionSummary = withStyles({
//     root: {
//         backgroundColor: 'rgba(0, 0, 0, .03)',
//         borderBottom: '1px solid rgba(0, 0, 0, .125)',
//         marginBottom: -1,
//         minHeight: 56,
//         '&$expanded': {
//         minHeight: 56,
//         },
//     },
//     content: {
//         '&$expanded': {
//         margin: '12px 0',
//         },
//     },
//     expanded: {},
//     })(MuiAccordionSummary);

//     const AccordionDetails = withStyles((theme) => ({
//     root: {
//         padding: theme.spacing(2),
// },
// }))(MuiAccordionDetails);

// const useStyle = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//     },
//     oddColor:{
//         backgroundColor: '#e9e9e9',
//     },
//     backButton: {
//         marginRight: theme.spacing(1),
//     },
//     instructions: {
//         marginTop: theme.spacing(1),
//         marginBottom: theme.spacing(1),
//     },
//     codeContainer:{
//         paddingLeft: '10px',
//         paddingTop: '5px',
//         paddingRight: '5px',
//         paddingBottom: '5px',
//         borderLeft: "5px solid #e5e5e5",
//         marginBottom: "10px"
//     }
// }));

// export default function DetailTab({exam})
// {
//     const [expanded, setExpanded] = React.useState('');
//     const [activeStep, setActiveStep] = React.useState(0);

//     const steps =
//     [
//         `Created at ${dateFormat(new Date(exam.createdOn),'HH:MM TT, dd-mmmm-yyyy')}`,
//         `Published at ${dateFormat(new Date(exam.startAt),'HH:MM TT, dd-mmmm-yyyy')}`,
//         `End at ${dateFormat(new Date(exam.endAt),'HH:MM TT, dd-mmmm-yyyy')}`
//     ];

//     React.useEffect(()=>{
//         if(Date.parse(exam.startAt) > Date.now())
//         {
//             setActiveStep(1);
//         }
//         if(Date.parse(exam.startAt) < Date.now() && Date.parse(exam.endAt) > Date.now())
//         {
//             setActiveStep(2);
//         }
//         if(Date.parse(exam.endAt) < Date.now())
//         {
//             setActiveStep(3);
//         }
//     },[]);

//     const handleChange = (panel) => (event, newExpanded) => {
//         setExpanded(newExpanded ? panel : false);
//     };

//     const classes = useStyle();

//     return (
//         <>
//             <Box display="flex" justifyContent="flex-end">
//                 <Tooltip title="Update is only available before examination's publishment">
//                     <IconButton aria-label="delete">
//                         <HelpIcon/>
//                     </IconButton>
//                 </Tooltip>
//                 {
//                     Date.parse(exam.startAt) - Date.now() > 0 ?
//                     <Button variant="contained" color="secondary" href={`/examiner/examinations/update?id=${exam.id}`}>
//                         Update
                
//                     </Button>
//                     :
//                     <Button variant="contained" color="secondary" disabled>
//                     Update
//                     </Button>

//                 }
//             </Box>
//             <Typography variant="h3">
//             {exam.isPrivate ? 
//                  <Tooltip title="Examination is private">
//                     <IconButton aria-label="delete">
//                         <LockIcon/>
//                     </IconButton>
//                  </Tooltip> : null
//             }
//             {exam.title}
//             </Typography>
//             <div className={classes.root}>
//                 <Stepper activeStep={activeStep} alternativeLabel>
//                     {steps.map((label) => (
//                     <Step key={label}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                     ))}
//                 </Stepper>
//             </div>
//             <Typography><b>ID</b>: {exam.id}</Typography>
//             {
//                 exam.modifiedAt ?
//                 <Typography><b>Modified at</b>: {
//                     dateFormat(
//                         new Date(exam.modifiedAt),
//                         'HH:MM TT, dd-mmmm-yyyy'
//                       )}
//                 </Typography> : null
//             }
//             {
//                 exam.isPrivate ? 
//                 <Typography><b>Password</b>: {exam.password}</Typography> : null
//             } 
//             <hr />
//             {
//                 HTMLReactParser(exam.content)
//             }
//             <hr />
//             <div>
//                 {
//                     exam.problems.map((value,key)=>(
//                     <Accordion square expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
//                         <AccordionSummary className={key % 2 !== 0 ? classes.oddColor : null} aria-controls="panel1d-content" id="panel1d-header">
//                             <Typography>
//                                 #{key+1}&nbsp;
//                                 {
//                                     value.isMCQ ?
//                                     <span>(Multiple choices)</span>
//                                     :
//                                     <span>(Coding problem)</span>
//                                 }
//                             </Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             {
//                                 value.isMCQ ?
//                                 <div>
//                                     {
//                                         HTMLReactParser(value.question)
//                                     }
//                                     <ol type="A">
//                                         <li>
//                                         {
//                                             HTMLReactParser(value.a)
//                                         }
//                                         </li>
//                                         <li>
//                                         {
//                                             HTMLReactParser(value.b)
//                                         }
//                                         </li>
//                                         <li>
//                                         {
//                                             HTMLReactParser(value.c)
//                                         }
//                                         </li>
//                                         <li>
//                                         {
//                                             HTMLReactParser(value.d)
//                                         }
//                                         </li>
//                                     </ol>
//                                     <Typography><b>Correct</b>: {value.correct}</Typography>
//                                     {
//                                         value.difficulty === 0 ? 
//                                         <Typography><b>Difficulty</b>: Easy</Typography> : null
//                                     }
//                                     {
//                                         value.difficulty === 1 ? 
//                                         <Typography><b>Difficulty</b>: Medium</Typography> : null
//                                     }
//                                     {
//                                         value.difficulty === 2 ? 
//                                         <Typography><b>Difficulty</b>: Hard</Typography> : null
//                                     }
//                                     <Typography><b>Score</b>: {value.score}</Typography>
//                                     <Typography><b>Time</b>: {value.minutes}m {value.seconds}s</Typography>
//                                 </div>
//                                 :
//                                 <div>
//                                     {
//                                         HTMLReactParser(value.title)
//                                     }
//                                     {
//                                         HTMLReactParser(value.content)
//                                     }
//                                     {
//                                         value.difficulty === 0 ? 
//                                         <Typography><b>Difficulty</b>: Easy</Typography> : null
//                                     }
//                                     {
//                                         value.difficulty === 1 ? 
//                                         <Typography><b>Difficulty</b>: Medium</Typography> : null
//                                     }
//                                     {
//                                         value.difficulty === 2 ? 
//                                         <Typography><b>Difficulty</b>: Hard</Typography> : null
//                                     }

                                    
//                                     <Typography><b>Score</b>: {value.score}</Typography>
//                                     <Typography><b>Time</b>: {value.minutes}m {value.seconds}s</Typography>
//                                     <Typography><b>Languague</b>: {value.language}</Typography>
//                                     <div className={classes.codeContainer}>
//                                         <code>
//                                             <pre>{value.code}</pre>
//                                         </code>
//                                     </div>
                                    
//                                     {value.cases.map((item,k)=>(
//                                         // eslint-disable-next-line react/no-array-index-key
//                                         <Typography key={k}><b>Test case #{k+1}:</b> input: {item.input} / output: {item.output}</Typography>
//                                     ))}
//                                 </div>
//                             }
//                         </AccordionDetails>
//                      </Accordion>
//                     ))
//                 }
//             </div>      
//         </>
//     )
// }