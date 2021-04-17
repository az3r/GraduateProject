import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, FormControlLabel, Grid, makeStyles, NativeSelect, Radio, RadioGroup, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Scrollspy from 'react-scrollspy'


const useStyles = makeStyles({
    whiteBackground:{
        backgroundColor: "#ffffff"
    },
    textSuccess: {
      color: '#52C41A',
    },
    textFail: {
      color: '#F74B4D',
    },
    displayScrollSpy: {
        position: "fixed",
        marginRight: "15px"
    },
    isCurrent: {
        fontWeight: 'bold',
        "& :nth-child(1)": {
            color: "#088247",
            fontSize: "18px"
          }
    },
    contentScrollSpy: {
        color: "#000000",
        fontSize: "16px",
        wordWrap: "break-word",
        textDecoration: 'none'
    },
    listContentStyle : {
        listStyle: "none",
    },
    listItem: {
        marginBottom: "10px"
    }
  });


export default function MultipleChoiceForm({onFormSubmit, propQuestion, displayScrollSpy})
{
    const classes = useStyles();

    const difficulty = propQuestion !== null ? propQuestion.difficulty : 0;
    const [question,setQuestion] = useState({
      isMCQ: true,
      question: propQuestion?.question,
      difficulty,
      score: propQuestion?.score,
      a: propQuestion?.a,
      b: propQuestion?.b,
      c: propQuestion?.c,
      d: propQuestion?.d,
      correct: propQuestion?.correct,
    });

    // const [message,setMessage] = useState({
    //     question: false,
    //     difficulty: false,
    //     score: false,
    //     a: false,
    //     b: false,
    //     c: false,
    //     d: false,
    //     correct: false,
    // });

    const handleChangeQuestion = (event,editor) => {
        const contentText = editor.getData();
        setQuestion({...question, question: contentText});
    }

    const handleChangeScore = (e) => {
        setQuestion({...question, score: Number(e.target.value)});
    };

    const handleChangeDifficulty = (e) => {
        setQuestion({...question, difficulty: Number(e.target.value)});
    }

    const handleChangeAnswerA = (event,editor) => {
      const contentText = editor.getData();
      setQuestion({...question, a: contentText});
    }
    const handleChangeAnswerB = (event,editor) => {
      const contentText = editor.getData();
      setQuestion({...question, b: contentText});
    }
    const handleChangeAnswerC = (event,editor) => {
      const contentText = editor.getData();
      setQuestion({...question, c: contentText});
    }
    const handleChangeAnswerD = (event,editor) => {
      const contentText = editor.getData();
      setQuestion({...question, d: contentText});
    }

    const handleChangeCorrectAnswer = (e) => {
      setQuestion({...question, correct: e.target.value});
    }


    const handleClickSubmit = (e) => {
        e.preventDefault();

        onFormSubmit(question);
    }
    return(
        <Grid container direction="row">
            <Grid item lg={ displayScrollSpy ? 9 : 12}>
                <form onSubmit={handleClickSubmit}>
                  <Box boxShadow={2} p={2} m={3} className={classes.whiteBackground}>
                    <Box p={2} m={3} id="section-1">
                      <Typography variant="h5">Enter question: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={question.question}
                            onChange={handleChangeQuestion}/>
                    </Box>

                    <Box p={2} m={3} id="section-2">
                        <Typography variant="h5">Enter score: </Typography>
                        <input onChange={handleChangeScore} type="number" max="100" min="0" value={question.score} />
                    </Box>

                    <Box p={2} m={3} id="section-3">
                        <Typography variant="h5">Choose level of difficulty: </Typography>
                        <NativeSelect
                            onChange={handleChangeDifficulty}>
                                {
                                    question.difficulty === 0 ?
                                    <option value={0} selected >Easy</option>
                                    :
                                    <option value={0}>Easy</option>
                                }
                                {
                                    question.difficulty === 1 ?
                                    <option value={1} selected>Medium</option>
                                    :
                                    <option value={1}>Medium</option>
                                }
                                {
                                    question.difficulty === 2 ?
                                    <option value={2} selected>Hard</option>
                                    :
                                    <option value={2}>Hard</option>
                                }
                        </NativeSelect>
                    </Box>
                  </Box>


                  <Box boxShadow={2} p={2} m={3} id="section-4" className={classes.whiteBackground}>
                    <Box p={2} m={3}>
                        <Typography variant="h5">Enter answer A: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={question.a}
                            onChange={handleChangeAnswerA}/>
                    </Box>

                    <Box p={2} m={3}>
                        <Typography variant="h5">Enter answer B: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={question.b}
                            onChange={handleChangeAnswerB}/>
                    </Box>

                    <Box p={2} m={3}>
                        <Typography variant="h5">Enter answer C: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={question.c}
                            onChange={handleChangeAnswerC}/>
                    </Box>

                    <Box p={2} m={3}>
                        <Typography variant="h5">Enter answer D: </Typography>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={question.d}
                            onChange={handleChangeAnswerD}/>
                    </Box>

                    <Box p={2} m={3} id="section-5">
                        <Typography variant="h5">Choose correct answer: </Typography>
                            <RadioGroup name="answer" value={question.correct} onChange={handleChangeCorrectAnswer}>
                              <FormControlLabel value="A" control={<Radio />} label="A" />
                              <FormControlLabel value="B" control={<Radio />} label="B" />
                              <FormControlLabel value="C" control={<Radio />} label="C" />
                              <FormControlLabel value="D" control={<Radio />} label="D" />
                          </RadioGroup>
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="center" p={2} m={3} id="section-6">
                      <Button color="primary" variant="contained" type="submit">Submit</Button>
                  </Box>

                </form>
            </Grid>
            {
                displayScrollSpy ? 
                <Grid item lg={3}>
                    <div className={classes.displayScrollSpy}>
                        <Typography variant="h5">Content:</Typography>
                        <Scrollspy className={classes.listContentStyle}
                        items={ ['section-1', 'section-2', 'section-3', 'section-4', 'section-4'] } currentClassName={classes.isCurrent}>
                            <li className={classes.listItem}><a href="#section-1" className={classes.contentScrollSpy}>Enter question</a></li>
                            <li className={classes.listItem}><a href="#section-2" className={classes.contentScrollSpy}>Enter score</a></li>
                            <li className={classes.listItem}><a href="#section-3" className={classes.contentScrollSpy}>Choose level of difficulty</a></li>
                            <li className={classes.listItem}><a href="#section-4" className={classes.contentScrollSpy}>Enter answers for A B C D</a></li>
                            <li className={classes.listItem}><a href="#section-5" className={classes.contentScrollSpy}>Choose correct answer</a></li>
                            <li className={classes.listItem}><a href="#section-6" className={classes.contentScrollSpy}>Submit problem and finish</a></li>
                        </Scrollspy>
                    </div>    
                </Grid>
                : null
            }   
        </Grid>
    );
}