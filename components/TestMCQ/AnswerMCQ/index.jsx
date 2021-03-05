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
    height: "500px",
  }
});

export default function AnswerMCQ() {
  const classes = styles();

  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Box className={classes.answerMCQBox}>
        <h2>Choose your answer: </h2>
        <RadioGroup  aria-label="gender" name="gender1" value={value} onChange={handleChange}>
          <FormControlLabel value="A" control={<Radio />} label={HTMLReactParser('<h4>A. Đáp án A</h4>')} />
          <FormControlLabel value="B" control={<Radio />} label={HTMLReactParser('<h4>B. Đáp án B</h4>')} />
          <FormControlLabel value="C" control={<Radio />} label={HTMLReactParser('<h4>C. Đáp án C</h4>')} />
          <FormControlLabel value="D" control={<Radio />} label={HTMLReactParser('<h4>D. Đáp án D</h4>')} />
        </RadioGroup>
      </Box>
    </>
  );
}
