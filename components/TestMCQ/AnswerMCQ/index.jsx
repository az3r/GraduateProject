import React from 'react';
import {
  makeStyles,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';

import HTMLReactParser from 'html-react-parser';


const styles = makeStyles({
  answerMCQBox: {
    paddingLeft: 20,
    paddingTop: 20,
  }
});

export default function AnswerMCQ({answer, onAnswerChange, a, b, c, d}) {
  const classes = styles();


  const handleAnswerChange = (event) => {
    onAnswerChange(event.target.value);
  };

  return (
    <>
      <Box className={classes.answerMCQBox} style={{width: '100%', height: window.outerHeight - 137 - 100}}>
        <h2>Choose your answer: </h2>
        <RadioGroup  aria-label="gender" name="gender1" value={answer} onChange={handleAnswerChange}>
          {
            a !== '' && <FormControlLabel value="A" control={<Radio />} label={HTMLReactParser(a)} />
          }
          {
            b !== '' && <FormControlLabel value="B" control={<Radio />} label={HTMLReactParser(b)} />
          }
          {
            c !== '' && <FormControlLabel value="C" control={<Radio />} label={HTMLReactParser(c)} />
          }
          {
            d !== '' && <FormControlLabel value="D" control={<Radio />} label={HTMLReactParser(d)} />
          }
        </RadioGroup>
      </Box>
    </>
  );
}
