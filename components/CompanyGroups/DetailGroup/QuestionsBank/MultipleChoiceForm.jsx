import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Box,
  Button,
  FormControlLabel,
  makeStyles,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'insertTable',
      '|',
      'undo',
      'redo'
    ]
  },
  table: {
    contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
  },
  language: 'en'
};

const useStyles = makeStyles({
  whiteBackground: {
    backgroundColor: '#ffffff',
  },
  textSuccess: {
    color: '#52C41A',
  },
  textFail: {
    color: '#F74B4D',
  },
  displayScrollSpy: {
    position: 'fixed',
    marginRight: '15px',
  },
  isCurrent: {
    fontWeight: 'bold',
    '& :nth-child(1)': {
      color: '#088247',
      fontSize: '14px',
    },
  },
  contentScrollSpy: {
    color: '#000000',
    fontSize: '13px',
    wordWrap: 'break-word',
    textDecoration: 'none',
  },
  listContentStyle: {
    listStyle: 'none',
  },
  listItem: {
    marginBottom: '10px',
  },
  error: {
    color: 'red !important',
  },
  input: {
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
});

export default function MultipleChoiceForm({ onFormSubmit, propQuestion }) {
  const classes = useStyles();
  const difficulty = propQuestion !== null ? propQuestion.difficulty : 0;
  const [question, setQuestion] = useState({
    isMCQ: true,
    question: propQuestion?.title,
    difficulty,
    score: propQuestion?.score,
    a: propQuestion?.answers.A,
    b: propQuestion?.answers.B,
    c: propQuestion?.answers.C,
    d: propQuestion?.answers.D,
    correct: propQuestion?.correctIndices,
  });

  const [message, setMessage] = useState({
    question: false,
    difficulty: false,
    score: false,
    a: false,
    b: false,
    c: false,
    d: false,
    correct: false,
    message: '',
  });

  const handleChangeQuestion = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, question: true });
    } else {
      setMessage({ ...message, question: false, message: '' });
    }
    setQuestion({ ...question, question: contentText });
  };

  const handleChangeScore = (e) => {
    const { value } = e.target;
    if (Number(value) < 0 || Number(value) > 100) {
      return;
    }
    setQuestion({ ...question, score: Number(e.target.value) });
    setMessage({ ...message, score: false, message: '' });
  };

  const handleChangeDifficulty = (e) => {
    setQuestion({ ...question, difficulty: Number(e.target.value) });
  };

  const handleChangeAnswerA = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, a: true });
    } else {
      setMessage({ ...message, a: false, message: '' });
    }
    setQuestion({ ...question, a: contentText });
  };
  const handleChangeAnswerB = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, b: true });
    } else {
      setMessage({ ...message, b: false, message: '' });
    }
    setQuestion({ ...question, b: contentText });
  };
  const handleChangeAnswerC = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, c: true });
    } else {
      setMessage({ ...message, c: false, message: '' });
    }
    setQuestion({ ...question, c: contentText });
  };
  const handleChangeAnswerD = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, d: true });
    } else {
      setMessage({ ...message, d: false, message: '' });
    }
    setQuestion({ ...question, d: contentText });
  };

  const handleChangeCorrectAnswer = (e) => {
    setQuestion({ ...question, correct: e.target.value });
    setMessage({ ...message, correct: false, message: '' });
  };

  function validate() {
    if (question.question === undefined || question.question === '') {
      setMessage({
        ...message,
        question: true,
        message: 'Problem question must not be empty',
      });
      return false;
    }
    if (question.score === undefined) {
      setMessage({
        ...message,
        score: true,
        message: 'Problem score must not be empty',
      });
      return false;
    }
    if (question.a === undefined || question.a === '') {
      setMessage({
        ...message,
        a: true,
        message: 'Answer A content must not be empty',
      });
      return false;
    }
    if (question.b === undefined || question.b === '') {
      setMessage({
        ...message,
        b: true,
        message: 'Answer B content must not be empty',
      });
      return false;
    }
    if (question.c === undefined || question.c === '') {
      setMessage({
        ...message,
        c: true,
        message: 'Answer C content must not be empty',
      });
      return false;
    }
    if (question.d === undefined || question.d === '') {
      setMessage({
        ...message,
        d: true,
        message: 'Answer D content must not be empty',
      });
      return false;
    }
    if (question.correct === undefined || question.correct === '') {
      setMessage({
        ...message,
        correct: true,
        message: 'Correct answer must be chosen',
      });
      return false;
    }
    return true;
  }

  const handleClickSubmit = (e) => {
    e.preventDefault();
    const valid = validate();

    if (valid)
      onFormSubmit({
        isMCQ: true,
        title: question.question,
        score: question.score,
        difficulty: question.difficulty,
        answers: {
          A: question.a,
          B: question.b,
          C: question.c,
          D: question.d,
        },
        correctIndices: question.correct,
      });
  };
  return (
    <Box>
      <form onSubmit={handleClickSubmit}>
        <Box boxShadow={2} p={2} m={3} className={classes.whiteBackground}>
          <Box m={3} p={2} display="flex" justifyContent="center">
            <Typography color="secondary" variant="h4">
              GENERAL INFORMATION SECTION
            </Typography>
          </Box>
          <Box p={2} m={3} id="MC-1">
            <Typography variant="h5">Enter question: </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={question.question}
              onChange={handleChangeQuestion}
              
            />
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.question ? classes.error : null}
            >
              Problem question must not be empty
            </p>
          </Box>

          <Box p={2} m={3} id="MC-2">
            <Typography variant="h5">Enter score: </Typography>
            <TextField
              className={classes.input}
              onChange={handleChangeScore}
              type="number"
              value={question.score}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
              helperText="Problem score must be in range of 0 &le; score &le; 100"
              error={message.score}
            />
          </Box>

          <Box p={2} m={3} id="MC-3">
            <Typography variant="h5">Choose level of difficulty: </Typography>
            <NativeSelect
              value={question.difficulty}
              onChange={handleChangeDifficulty}
            >
              <option value={0}>Easy</option>
              <option value={1}>Medium</option>
              <option value={2}>Hard</option>
            </NativeSelect>
          </Box>
        </Box>

        <Box
          boxShadow={2}
          p={2}
          m={3}
          id="MC-4"
          className={classes.whiteBackground}
        >
          <Box m={3} p={2} display="flex" justifyContent="center">
            <Typography color="secondary" variant="h4">
              ANSWERS SECTION
            </Typography>
          </Box>
          <Box p={2} m={3}>
            <Typography variant="h5">Enter answer A: </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={question.a}
              onChange={handleChangeAnswerA}
            />
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.a ? classes.error : null}
            >
              Answer A content must not be empty
            </p>
          </Box>

          <Box p={2} m={3}>
            <Typography variant="h5">Enter answer B: </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={question.b}
              onChange={handleChangeAnswerB}
            />
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.b ? classes.error : null}
            >
              Answer B content must not be empty
            </p>
          </Box>

          <Box p={2} m={3}>
            <Typography variant="h5">Enter answer C: </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={question.c}
              onChange={handleChangeAnswerC}
            />
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.c ? classes.error : null}
            >
              Answer C content must not be empty
            </p>
          </Box>

          <Box p={2} m={3}>
            <Typography variant="h5">Enter answer D: </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={question.d}
              onChange={handleChangeAnswerD}
            />
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.d ? classes.error : null}
            >
              Answer D content must not be empty
            </p>
          </Box>

          <Box p={2} m={3} id="MC-5">
            <Typography variant="h5">Choose correct answer: </Typography>
            <RadioGroup
              name="answer"
              value={question.correct}
              onChange={handleChangeCorrectAnswer}
            >
              <FormControlLabel value="A" control={<Radio />} label="A" />
              <FormControlLabel value="B" control={<Radio />} label="B" />
              <FormControlLabel value="C" control={<Radio />} label="C" />
              <FormControlLabel value="D" control={<Radio />} label="D" />
            </RadioGroup>
            <p
              style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
              className={message.correct ? classes.error : null}
            >
              Correct answer must be chosen
            </p>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography className={classes.error}>{message.message}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" p={2} m={3} id="MC-6">
          <Button color="primary" variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
