// import React, { useState } from 'react';
// import { makeStyles, withStyles } from '@material-ui/core/styles';
// import MuiAccordion from '@material-ui/core/Accordion';
// import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
// import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
// import { Box } from '@material-ui/core';
// // import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
// import CodingProblem from './CodingProblem/index';
// import MultipleChoices from './MultipleChoices/index'; 

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
  
//   const AccordionSummary = withStyles({
//     root: {
//       backgroundColor: 'rgba(0, 0, 0, .03)',
//       borderBottom: '1px solid rgba(0, 0, 0, .125)',
//       marginBottom: -1,
//       minHeight: 56,
//       '&$expanded': {
//         minHeight: 56,
//       },
//     },
//     content: {
//       '&$expanded': {
//         margin: '12px 0',
//       },
//     },
//     expanded: {},
//   })(MuiAccordionSummary);
  
//   const AccordionDetails = withStyles((theme) => ({
//     root: {
//       padding: theme.spacing(2),
//     },
//   }))(MuiAccordionDetails);

//   const useStyle = makeStyles({
//     oddColor:{
//         backgroundColor: '#e9e9e9',
//     },
//     deleteIcon:{
//       color: "red",
//       float: "right"
//     }
// })

// export default function Questions({listOfQuestions,handleChangeQuestionMC,handleChangeAnswerMC,handleChangeCorrectAnswer,handleChangeScore,
//     handleChangeCPTitle,handleChangeLanguague,handleChangeCPInfo,handleChangeCPDifficulty,handleChangeCPCode,handleChangeCPFiles,
//     handleChangeSimpleTest,handleTestCode,handleChangeMinutes,handleChangeSeconds}){

//   const [expanded, setExpanded] = useState('');
//   const classes = useStyle();
//   const handleChange = (panel) => (event, newExpanded) => {
//       setExpanded(newExpanded ? panel : false);
//   };
//   return (
//     <div>
//       {/* <Button onClick={()=>handleDeleteQuestion(0)}>haha</Button> */}
//       {listOfQuestions.map((value,key)=> (
//           // eslint-disable-next-line react/no-array-index-key
//           <Box style={{marginLeft: "1.5em", marginRight: "1.5em"}} key={key}>
//             <Accordion square expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
//                 <AccordionSummary className={key % 2 !== 0 ? classes.oddColor : null} aria-controls="panel1d-content" id="panel1d-header">
//                     {
//                       value.isMCQ ?
//                       <Typography>Question #{key + 1} (Multiple choices)</Typography>    
//                       :
//                       <Typography>Question #{key + 1} (Coding problem)</Typography>                                 
//                     }
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <div style={{width: "100%"}}>
//                   {
//                       value.isMCQ ?
//                         <MultipleChoices NO={key} value={value} handleChangeQuestionMC={handleChangeQuestionMC}
//                           handleChangeAnswerMC={handleChangeAnswerMC}
//                           handleChangeCorrectAnswer={handleChangeCorrectAnswer}
//                           handleChangeScore={handleChangeScore} handleChangeMinutes={handleChangeMinutes} 
//                           handleChangeSeconds={handleChangeSeconds} handleChangeCPDifficulty={handleChangeCPDifficulty}/>   
//                       :
//                         <CodingProblem NO={key} value={value} handleChangeScore={handleChangeScore} handleChangeCPTitle={handleChangeCPTitle}
//                           handleChangeCPInfo={handleChangeCPInfo} handleChangeLanguague={handleChangeLanguague} 
//                           handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeCPCode={handleChangeCPCode}
//                           handleChangeCPFiles={handleChangeCPFiles} handleChangeSimpleTest={handleChangeSimpleTest}
//                           handleTestCode={handleTestCode} handleChangeMinutes={handleChangeMinutes} 
//                           handleChangeSeconds={handleChangeSeconds}/>                             
//                     }
//                   </div>                                  
//                 </AccordionDetails>
//             </Accordion>
//           </Box>
//       ))}
//     </div>
//   )
// }