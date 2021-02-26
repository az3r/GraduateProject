import React from 'react';
import {
  makeStyles,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';


const styles = makeStyles({
  answerMCQBox: {
    paddingLeft: 20,
    paddingTop: 20,
    height: "500px",
  }
});

export default function AnswerMCQ() {
  const classes = styles();

  const [value, setValue] = React.useState('A');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Box className={classes.answerMCQBox}>
        <h2>Choose your answer: </h2>
        <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
          <FormControlLabel value="A" control={<Radio />} label="A. Đáp án A" />
          <FormControlLabel value="B" control={<Radio />} label="B. Đáp án B" />
          <FormControlLabel value="C" control={<Radio />} label="C. Đáp án C" />
          <FormControlLabel value="D" control={<Radio />} label="D. Đáp án D" />
        </RadioGroup>
      </Box>
    </>
  );
}
