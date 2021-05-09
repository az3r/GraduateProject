import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { useRouter } from 'next/router';
import { create, createMCQ, get } from '@libs/client/problems';
import HelpIcon from '@material-ui/icons/Help';
import { getScoreOfCases } from '@libs/client/business';
import AddProblemFromLibrary from './AddProblemFromLibrary';
import NewQuestionForExamination from './NewQuestionForExamination';
import QuestionInfo from './QuestionInfo';
import EditQuestionForExamination from './EditQuestionForExamination';

const useStyles = makeStyles((theme) => ({
  whiteBackground: {
    backgroundColor: '#ffffff',
  },
  textSuccess: {
    color: '#52C41A',
  },
  textFail: {
    color: '#F74B4D',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 500,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  error: {
    color: 'red !important',
  },
  tabPane: {
    width: '80%',
    overflow: 'scroll',
  },
  deleteBtn: {
    color: 'red',
    float: 'right',
  },
  input: {
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function EditExamination({ user, examProp, onSubmitExam }) {
  const classes = useStyles();
  const published = examProp?.published || false;
  const duration = examProp?.duration || 0;
  const isPrivate = examProp?.isPrivate || false;
  const questions = examProp?.problems || [];
  const [exam, setExam] = useState({
    title: examProp?.title,
    content: examProp?.content,
    password: examProp?.password,
    published,
    duration,
    isPrivate,
    start: examProp?.start,
    end: examProp?.end,
    questions,
  });
  const [message, setMessage] = useState({
    message: '',
    title: false,
    content: false,
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [valueTab, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [questionEdit, setQuestionEdit] = useState({});
  const router = useRouter();
  const { id } = router.query;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = (o) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenDrawer(o);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleChangeTitle = (e) => {
    const { value } = e.target;
    if (value === '') {
      setMessage({ ...message, title: true });
    } else {
      setMessage({ ...message, title: false, message: '' });
    }
    setExam({ ...exam, title: value });
  };

  const handleChangeContent = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, content: true });
    } else {
      setMessage({ ...message, content: false, message: '' });
    }
    setExam({ ...exam, content: contentText });
  };

  const handleChangeMinutes = (e) => {
    const { value } = e.target;
    if (Number(value) < 0 || Number(value) > 100) return;
    const currentDuration = exam.duration;
    const currentSeconds = currentDuration % 60;
    setExam({ ...exam, duration: Number(value) * 60 + currentSeconds });
    setMessage({ ...message, duration: false, message: '' });
  };

  const handleChangeSeconds = (e) => {
    const { value } = e.target;
    if (Number(value) < 0 || Number(value) > 100) return;
    const currentDuration = exam.duration;
    const currentMinutes = Math.floor(currentDuration / 60);
    setExam({ ...exam, duration: currentMinutes * 60 + Number(value) });
    setMessage({ ...message, duration: false, message: '' });
  };

  const handleTickPublished = (event) => {
    setExam({ ...exam, isPrivate: event.target.checked });
  };

  const handleAddQuestionFromLibrary = (problem) => {
    setExam({ ...exam, questions: [...exam.questions, problem] });
  };

  const onAddQuestion = async (question, isSaved) => {
    if (isSaved) {
      let idProblem = '';
      if (!question.isMCQ) {
        idProblem = await create(id, question);
      } else {
        idProblem = await createMCQ(id, question);
      }
      const problem = await get({ problemId: idProblem });
      setExam({
        ...exam,
        questions: [...exam.questions, { id: idProblem, score: problem.score }],
      });
    } else {
      if (!question.isMCQ) {
        question.score = getScoreOfCases(question.cases);
      }
      setExam({ ...exam, questions: [...exam.questions, question] });
    }
    setOpen(false);
  };

  const handleEditQuestion = (idx, item) => {
    setQuestionEdit({
      index: idx,
      question: item,
    });
    setOpenEdit(true);
  };

  const onEditQuestion = (question) => {
    const newQuestions = [...exam.questions];
    newQuestions[questionEdit.index] = question;
    setExam({ ...exam, questions: newQuestions });
    setOpenEdit(false);
  };

  const handleDeleteQuestion = (index) => {
    const newListQuestion = [...exam.questions];
    newListQuestion.splice(index, 1);
    setExam({ ...exam, questions: newListQuestion });
    setValue(index - 1);
  };

  function validate() {
    if (exam.title === undefined || exam.title === '') {
      setMessage({
        ...message,
        title: true,
        message: 'Examination title must not be empty',
      });
      return false;
    }
    if (exam.content === undefined || exam.content === '') {
      setMessage({
        ...message,
        content: true,
        message: 'Examination content must not be empty',
      });
      return false;
    }
    if (exam.duration === 0) {
      setMessage({
        ...message,
        duration: true,
        message: 'Examination duration must not be empty',
      });
      return false;
    }
    if (exam.questions.length === 0) {
      setMessage({
        ...message,
        message: 'List of questions must not be empty',
      });
      return false;
    }
    return true;
  }

  const handleSubmitForm = () => {
    const valid = validate();
    if (valid) {
      const developerId = user.role === 'developer' ? user.id : undefined;
      const formatedExam = {
        title: exam.title,
        content: exam.content,
        duration: exam.duration,
        isPrivate: exam.isPrivate,
        problems: exam.questions,
        developerId,
      };
      onSubmitExam(formatedExam);
    }
  };

  return (
    <Box>
      <Box m={3} p={2} boxShadow={2} className={classes.whiteBackground}>
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            GENERAL INFORMATION SECTION
          </Typography>
        </Box>
        <Box m={3} p={2} id="section-20">
          <Typography variant="h5">* Enter title:</Typography>
          <TextField
            fullWidth
            value={exam.title}
            onChange={handleChangeTitle}
            error={message.title}
            helperText="Examination title must not be empty"
          />
        </Box>
        <Box p={2} m={3} id="section-21">
          <Typography variant="h5">* Enter content: </Typography>
          <CKEditor
            editor={ClassicEditor}
            onChange={handleChangeContent}
            data={exam.content}
          />
          <Typography
            style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
            className={message.content ? classes.error : null}
          >
            Examination content must not be empty
          </Typography>
        </Box>
        {/* <Box m={3} p={2} id="section-22">
                    <Typography variant="h5">Enter password:</Typography>
                    <TextField type="password" fullWidth/>
                </Box> */}
        <Box m={3} p={2} id="section-23">
          <Typography variant="h5">* Enter duration:</Typography>
          <Box display="flex">
            <TextField
              className={classes.input}
              type="number"
              value={Math.floor(exam.duration / 60)}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
              onChange={handleChangeMinutes}
            />
            <Typography>
              &nbsp;minute(s)&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
            </Typography>
            <TextField
              className={classes.input}
              type="number"
              value={exam.duration % 60}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 59,
                },
              }}
              onChange={handleChangeSeconds}
            />
            <Typography>&nbsp;second(s)&nbsp;&nbsp;</Typography>
          </Box>
          <Typography
            style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
            className={message.duration ? classes.error : null}
          >
            Examination duration must be &gt; 0 second
          </Typography>
        </Box>
        <Box m={3} p={2} id="section-22">
          <FormControlLabel
            control={
              <Checkbox
                checked={exam.isPrivate}
                onChange={handleTickPublished}
                name="checkedA"
              />
            }
            label="Is private examination?"
          />
        </Box>
      </Box>
      <Box
        boxShadow={2}
        m={3}
        p={2}
        id="section-24"
        className={classes.whiteBackground}
      >
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            QUESTIONS SECTION
          </Typography>
        </Box>
        <Box m={3} p={2}>
          <Button
            style={{ display: 'block', margin: '0 auto 20px auto' }}
            color="primary"
            variant="outlined"
            onClick={toggleDrawer(true)}
          >
            Add question from library
          </Button>
          <Typography style={{ textAlign: 'center' }}>or</Typography>
          <Button
            style={{ display: 'block', margin: '20px auto 20px auto' }}
            variant="outlined"
            color="primary"
            onClick={handleClickOpen}
          >
            Add new question
          </Button>
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={toggleDrawer(false)}
          >
            <AddProblemFromLibrary
              idCompany={id}
              questionsList={exam.questions}
              handleAddQuestionFromLibrary={handleAddQuestionFromLibrary}
            />
          </Drawer>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar} color="secondary">
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  Add question for examination
                </Typography>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <NewQuestionForExamination onFormSubmit={onAddQuestion} />
          </Dialog>
        </Box>
        {exam.questions.length > 0 ? (
          <div className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={valueTab}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              className={classes.tabs}
            >
              {exam.questions.map((item, index) => (
                <Tab label={`Question ${index + 1}`} {...a11yProps(index)} />
              ))}
            </Tabs>

            {exam.questions.map((item, idx) => (
              <TabPanel
                className={classes.tabPane}
                value={valueTab}
                index={idx}
              >
                <div style={{ display: 'float', float: 'right' }}>
                  <Tooltip title="You cannot edit question in company's questions bank">
                    <IconButton aria-label="delete" size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    color="primary"
                    onClick={() => handleEditQuestion(idx, item)}
                    disabled={!!item.id}
                  >
                    Edit question
                  </Button>
                  <Dialog
                    fullScreen
                    open={openEdit}
                    onClose={handleCloseEdit}
                    TransitionComponent={Transition}
                  >
                    <AppBar className={classes.appBar} color="secondary">
                      <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                          Edit question for examination
                        </Typography>
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={handleCloseEdit}
                          aria-label="close"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <EditQuestionForExamination
                      question={questionEdit.question}
                      onFormSubmitEdit={onEditQuestion}
                    />
                  </Dialog>
                </div>
                <QuestionInfo question={item} />
                <br />
                <Divider />
                <br />
                <Button
                  variant="outlined"
                  className={classes.deleteBtn}
                  onClick={() => handleDeleteQuestion(idx)}
                  startIcon={<DeleteIcon />}
                >
                  Delete question
                </Button>
              </TabPanel>
            ))}
          </div>
        ) : (
          <Typography>There are no records for list of questions</Typography>
        )}
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography className={classes.error}>{message.message}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" m={3}>
        <Button variant="contained" color="primary" onClick={handleSubmitForm}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
