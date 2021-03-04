import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import CodingProblem from './CodingProblem/index';
import MultipleChoices from './MultipleChoices/index';

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


export default function Questions({listOfQuestions,handleChangeQuestionMC,handleChangeAnswerMC,handleChangeCorrectAnswer,handleChangeScore,
    handleChangeCPTitle,handleChangeLanguague,handleChangeCPInfo,handleChangeCPDifficulty,handleChangeCPCode,handleChangeCPFiles,
    handleChangeSimpleTest,handleTestCode,handleChangeTime}){

    const [expanded, setExpanded] = useState('panel0');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <>
            {listOfQuestions.map((value,key)=> (
                // eslint-disable-next-line react/no-array-index-key
                <div key={key}>
                    {
                        value.isMCQ ? 
                        <Accordion square expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Question #{key + 1} (Multiple choices)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MultipleChoices NO={key} value={value} handleChangeQuestionMC={handleChangeQuestionMC}
                                handleChangeAnswerMC={handleChangeAnswerMC}
                                handleChangeCorrectAnswer={handleChangeCorrectAnswer}
                                handleChangeScore={handleChangeScore} handleChangeTime={handleChangeTime}/>
                            </AccordionDetails>
                        </Accordion>
                        :
                        <Accordion square expanded={expanded ===`panel${key}`} onChange={handleChange(`panel${key}`)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Question #{key + 1} (Coding problem)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CodingProblem NO={key} value={value} handleChangeScore={handleChangeScore} handleChangeCPTitle={handleChangeCPTitle}
                                    handleChangeCPInfo={handleChangeCPInfo} handleChangeLanguague={handleChangeLanguague} 
                                    handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeCPCode={handleChangeCPCode}
                                    handleChangeCPFiles={handleChangeCPFiles} handleChangeSimpleTest={handleChangeSimpleTest}
                                    handleTestCode={handleTestCode} handleChangeTime={handleChangeTime}/>
                            </AccordionDetails>
                        </Accordion>
                    }
                    <br/>
                </div>
            ))}
        </>

    )
}