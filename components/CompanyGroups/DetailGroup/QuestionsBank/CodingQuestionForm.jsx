import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CodeEditor from '@components/CodeEditor';
import getTestCaseFromInputAndOutput, {
  getFormatResultFromFile,
  getInitialCode,
} from '@libs/client/business';
import { test } from '@libs/client/submissions';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  LinearProgress,
  makeStyles,
  NativeSelect,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import clsx from 'clsx';
import React, { useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';


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

const useStyles = makeStyles((theme) => ({
  whiteBackground: {
    backgroundColor: '#ffffff',
  },
  textSuccess: {
    color: '#088247',
  },
  textFail: {
    color: '#F74B4D',
  },
  error: {
    color: 'red !important',
  },
  testCasesDialog: {
    width: 500,
    height: 300,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 270,
  },
  tabContent: {
    width: '65%',
    overflow: 'scroll',
    overflowX: 'hidden',
  },
  input: {
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function CodingQuestionForm({
  onFormSubmit,
  propQuestion,
  isSaved,
}) {
  const lang = propQuestion !== null ? propQuestion.language : 'Csharp';
  const difficulty = propQuestion !== null ? propQuestion.difficulty : 0;
  const published = propQuestion?.published || false;
  const code = propQuestion?.code || getInitialCode(lang);
  const cases = propQuestion?.cases || [];
  const input = cases.map((item) => item.input);
  const output = cases.map((item) => item.output);
  const casesScore = cases.map((item) => item.score);
  const runtime = propQuestion?.runtime || [];

  const classes = useStyles();
  const [question, setQuestion] = useState({
    isMCQ: false,
    title: propQuestion?.title,
    content: propQuestion?.content,
    difficulty,
    language: lang,
    code,
    simpleTest: {
      input: '',
      output: '',
    },
    input,
    output,
    casesScore,
    cases,
    runtime,
    published,
  });

  const [message, setMessage] = useState({
    message: '',
    title: false,
    content: false,
    code: false,
    simpleInput: false,
    simpleOutput: false,
    test: '',
    isTesting: false,
    testResult: false,
    isTestSuccess: false,
    input: false,
    output: false,
    casesScore: false,
    runtime: false,
    percentage: false,
  });
  const [valueTab, setValueTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [tempRuntime, setTempRuntime] = useState({
    runtime: 0,
    percentage: 0,
  });

  const handleChangeTitle = (e) => {
    const { value } = e.target;
    if (value === '') {
      setMessage({ ...message, title: true });
    } else {
      setMessage({ ...message, title: false, message: '' });
    }
    setQuestion({ ...question, title: value });
  };

  const handleChangeContent = (event, editor) => {
    const contentText = editor.getData();
    if (contentText === '') {
      setMessage({ ...message, content: true });
    } else {
      setMessage({ ...message, content: false, message: '' });
    }
    setQuestion({ ...question, content: contentText });
  };

  const handleChangeDifficulty = (e) => {
    setQuestion({ ...question, difficulty: Number(e.target.value) });
  };

  const handleChangeLanguague = (e) => {
    setQuestion({
      ...question,
      language: e.target.value,
      code: getInitialCode(e.target.value),
    });
    setMessage({ ...message, code: false, message: '' });
  };

  const handleOnChangeCode = (newCode) => {
    if (newCode === '') {
      setMessage({ ...message, code: true });
    } else {
      setMessage({ ...message, code: false, message: '' });
    }
    setQuestion({ ...question, code: newCode });
  };

  const handleChangeSimpleTest = (e) => {
    const type = e.target.name;
    if (type === 'simpleIn') {
      setQuestion({
        ...question,
        simpleTest: { ...question.simpleTest, input: e.target.value },
      });
      setMessage({ ...message, test: '', simpleInput: false });
    } else {
      setQuestion({
        ...question,
        simpleTest: { ...question.simpleTest, output: e.target.value },
      });
      setMessage({ ...message, test: '', simpleOutput: false });
    }
  };

  const handleTestCode = async () => {
    if (question.code === '') {
      setMessage({
        ...message,
        test: 'Cannot test due to code is empty',
        code: true,
        testResult: true,
      });
      return;
    }
    if (question.simpleTest.input === '') {
      setMessage({
        ...message,
        test: 'Simple input for test case is empty',
        simpleInput: true,
        testResult: true,
      });
      return;
    }
    if (question.simpleTest.output === '') {
      setMessage({
        ...message,
        test: 'Simple output for test case is empty',
        simpleOutput: true,
      });
      return;
    }

    setMessage({
      ...message,
      simpleInput: false,
      simpleOutput: false,
      test: '',
      isTesting: true,
    });

    try {
      const result = await test({
        lang: question.language,
        code: question.code,
        testcases: [
          {
            input: question.simpleTest.input,
            output: question.simpleTest.output,
            score: 0,
          },
        ],
        runtime: []
      });

      let resultMessage = '';
      let passed = false;
      if (result.failed === 1) {
        resultMessage = `Test failed!\nExpected output: ${result.results[0].expected}\nActual output: ${result.results[0].actual}\nRuntime: ${result.totalElapsedTime} ms`;
      } else {
        resultMessage = `Test passed!\nRuntime: ${result.totalElapsedTime} ms`;
        passed = true;
      }

      setMessage({
        ...message,
        test: resultMessage,
        isTesting: false,
        testResult: result.failed === 1,
        isTestSuccess: passed,
        message: '',
      });
    } catch (err) {
      setMessage({
        ...message,
        test: `Error!\nMessage: ${err.status}`,
        isTesting: false,
        testResult: true,
        isTestSuccess: false,
        message: '',
      });
    }
  };

  const handleChangeTestCaseFiles = (e) => {
    const type = e.target.name;
    if (e.target.files[0] !== undefined) {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const text = event.target.result;
        const fileData = getFormatResultFromFile(text);

        if (type === 'input') {
          const testCases = getTestCaseFromInputAndOutput(
            fileData,
            question.output,
            question.casesScore
          );
          setQuestion({ ...question, input: fileData, cases: testCases });
          setMessage({ ...message, input: false, message: '' });
        } else if (type === 'output') {
          const testCases = getTestCaseFromInputAndOutput(
            question.input,
            fileData,
            question.casesScore
          );
          setQuestion({ ...question, output: fileData, cases: testCases });
          setMessage({ ...message, output: false, message: '' });
        } else {
          const testCases = getTestCaseFromInputAndOutput(
            question.input,
            question.output,
            fileData
          );
          setQuestion({ ...question, casesScore: fileData, cases: testCases });
          setMessage({ ...message, casesScore: false, message: '' });
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleTickPublished = (event) => {
    setQuestion({ ...question, published: event.target.checked });
  };

  const handleRuntimeChange = (e) => {
    setTempRuntime({ ...tempRuntime, runtime: Number(e.target.value) });
    setMessage({ ...message, runtime: false });
  };

  const handlePercentageChange = (e) => {
    setTempRuntime({ ...tempRuntime, percentage: Number(e.target.value) });
    setMessage({ ...message, percentage: false });
  };

  const handleAddRuntime = () => {
    if (tempRuntime.runtime === 0) {
      setMessage({ ...message, runtime: true });
      return;
    }
    if (tempRuntime.percentage === 0 || tempRuntime.percentage > 100) {
      setMessage({ ...message, percentage: true });
      return;
    }
    let tempRuntimeList = [...question.runtime];
    const lastRuntime = tempRuntimeList[tempRuntimeList.length - 1];
    if (!lastRuntime) {
      tempRuntimeList = [...tempRuntimeList, tempRuntime];
      setQuestion({ ...question, runtime: tempRuntimeList });
    } else {
      if (tempRuntime.runtime <= lastRuntime.runtime) {
        setMessage({ ...message, runtime: true });
        return;
      }
      if (tempRuntime.percentage >= lastRuntime.percentage) {
        setMessage({ ...message, percentage: true });
        return;
      }
      tempRuntimeList = [...tempRuntimeList, tempRuntime];
      setQuestion({ ...question, runtime: tempRuntimeList });
    }
  };

  const handleDeleteRuntime = (index) => {
    const tempRuntimeList = [...question.runtime];
    tempRuntimeList.splice(index, 1);
    setQuestion({ ...question, runtime: tempRuntimeList });
  };

  function validate() {
    if (question.title === undefined || question.title === '') {
      setMessage({
        ...message,
        title: true,
        message: 'Problem title must not be empty',
      });
      return false;
    }
    if (question.content === undefined || question.content === '') {
      setMessage({
        ...message,
        content: true,
        message: 'Problem content must not be empty',
      });
      return false;
    }
    if (question.code === '') {
      setMessage({
        ...message,
        code: true,
        message: 'Problem code must not be empty',
      });
      return false;
    }
    if (question.input.length === 0) {
      setMessage({
        ...message,
        input: true,
        message: 'Input file for test cases must be submitted',
      });
      return false;
    }
    if (question.output.length === 0) {
      setMessage({
        ...message,
        output: true,
        message: 'Output file for test cases must be submitted',
      });
      return false;
    }
    if (question.casesScore.length === 0) {
      setMessage({
        ...message,
        casesScore: true,
        message: 'Score file for test cases must be submitted',
      });
      return false;
    }
    if (question.runtime.length === 0) {
      setMessage({
        ...message,
        message: 'Runtime list must be submitted',
      });
      return false;
    }
    if (!message.isTestSuccess) {
      setMessage({
        ...message,
        message:
          'Problem must be tested successfully with a simple test case before submitting',
      });
      return false;
    }
    return true;
  }

  const handleClickSubmit = (e) => {
    e.preventDefault();
    const valid = validate();

    if (valid) {
      const formatedQuestion = { ...question };
      delete formatedQuestion.input;
      delete formatedQuestion.output;
      delete formatedQuestion.casesScore;
      delete formatedQuestion.simpleTest;
      onFormSubmit(formatedQuestion);
      setMessage({ ...message, isTestSuccess: false });
    }
  };
  return (
    <Box>
      <Box className={classes.whiteBackground} boxShadow={2} p={2} m={3}>
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            GENERAL INFORMATION SECTION
          </Typography>
        </Box>
        <Box p={2} m={3} id="CP-1">
          <Typography variant="h5">* Enter title: </Typography>
          <TextField
            name="title"
            value={question.title}
            onChange={handleChangeTitle}
            fullWidth
            error={message.title}
            helperText="Problem title must not be empty"
          />
        </Box>
        <Box p={2} m={3} id="CP-2">
          <Typography variant="h5">* Enter content: </Typography>
          <CKEditor
            editor={ClassicEditor}
            data={question.content}
            onChange={handleChangeContent}
          />
          <Typography
            style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
            className={message.content ? classes.error : null}
          >
            Problem content must not be empty
          </Typography>
        </Box>

        <Box p={2} m={3} id="CP-3">
          <Typography variant="h5">* Choose level of difficulty: </Typography>
          <NativeSelect
            value={question.difficulty}
            onChange={handleChangeDifficulty}
          >
            <option value={0}>Easy</option>
            <option value={1}>Medium</option>
            <option value={2}>Hard</option>
          </NativeSelect>
        </Box>

        <Box p={2} m={3} id="CP-4">
          <Typography variant="h5">* Choose programming language: </Typography>
          <NativeSelect
            value={question.language}
            onChange={handleChangeLanguague}
          >
            <option value="Csharp">C#</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </NativeSelect>
        </Box>
      </Box>

      <Box
        className={classes.whiteBackground}
        boxShadow={2}
        p={2}
        m={3}
        id="CP-5"
      >
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            CODE SECTION
          </Typography>
        </Box>
        <Box p={2} m={3}>
          <Typography variant="h5">* Enter code: </Typography>
          <ul>
            <li>
              <Typography>
                Step 1: Write full your code in the coding editor
              </Typography>
            </li>
            <li>
              <Typography>
                Step 2: Enter a simple input and output test case to verify your
                code
              </Typography>
            </li>
            <li>
              <Typography>
                Step 3: Click Test code button to test your code and input,
                output
              </Typography>
            </li>
          </ul>
          <CodeEditor
            language={question.language}
            code={question.code}
            onCodeChange={handleOnChangeCode}
            width="600"
            theme="xcode"
          />
          <Typography
            style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)' }}
            className={message.code ? classes.error : null}
          >
            Problem code must not be empty
          </Typography>
        </Box>
        <Box p={2} m={3}>
          <Typography variant="h5">
            * Test your code with a simple test case
          </Typography>
          <Box m={1}>
            <TextField
              multiline
              rows={3}
              value={question.simpleTest.input}
              label="Enter simple input"
              name="simpleIn"
              onChange={handleChangeSimpleTest}
              variant="outlined"
              error={message.simpleInput}
            />
            <TextField
              multiline
              rows={3}
              value={question.simpleTest.output}
              label="Enter simple output"
              name="simpleOut"
              onChange={handleChangeSimpleTest}
              variant="outlined"
              error={message.simpleOutput}
            />
          </Box>
          {message.isTesting ? (
            <Box m={1}>
              <LinearProgress style={{ width: 409.34 }} />
            </Box>
          ) : null}
          <Box m={1}>
            <Button color="primary" variant="outlined" onClick={handleTestCode}>
              Test code
            </Button>
          </Box>
          <Box m={1}>
            <pre
              style={{ fontSize: '1rem' }}
              className={clsx({
                [classes.textFail]: message.testResult,
                [classes.textSuccess]: !message.testResult,
              })}
            >
              {message.test}
            </pre>
          </Box>
          <a href='/guideline test case files.pdf' download>***Download guideline for format of submitted files***</a>
        </Box>
      </Box>

      <Box
        className={classes.whiteBackground}
        boxShadow={2}
        p={2}
        m={3}
        id="CP-6"
      >
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            TEST CASES SECTION
          </Typography>
        </Box>
        <Box p={2} m={3}>
          <Typography variant="h5">Submit input file: </Typography>
          <TextField
            type="file"
            accept=".txt"
            name="input"
            onChange={handleChangeTestCaseFiles}
            error={message.input}
            helperText="Input file for test cases must be submitted"
          />
        </Box>
        <Box p={2} m={3}>
          <Typography variant="h5">Submit expected output file: </Typography>
          <TextField
            type="file"
            accept=".txt"
            name="output"
            onChange={handleChangeTestCaseFiles}
            error={message.output}
            helperText="Output file for test cases must be submitted"
          />
        </Box>
        <Box p={2} m={3}>
          <Typography variant="h5">
            Submit test cases&apos;s scores file:{' '}
          </Typography>
          <TextField
            type="file"
            accept=".txt"
            name="score"
            onChange={handleChangeTestCaseFiles}
            error={message.casesScore}
            helperText="Score file for test cases must be submitted"
          />
        </Box>

        <Box p={2} m={3}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleClickOpen}
          >
            See submitted test cases
          </Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Current test cases
            </DialogTitle>
            <DialogContent className={classes.testCasesDialog}>
              {question.cases.length !== 0 ? (
                <div className={classes.root}>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={valueTab}
                    onChange={handleChangeTab}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                  >
                    {question.cases.map((_, index) => (
                      <Tab
                        label={`Test case ${index + 1}`}
                        {...a11yProps(index)}
                      />
                    ))}
                  </Tabs>
                  {question.cases.map((item, idx) => (
                    <TabPanel value={valueTab} index={idx}>
                      <Typography>Test case {idx + 1}:</Typography>
                      <pre>{`   {\n     input: ${item.input}\n     output: ${item.output}\n     score: ${item.score}\n   }`}</pre>
                    </TabPanel>
                  ))}
                </div>
              ) : (
                <Typography>
                  There are no records for list of question
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Box
        className={classes.whiteBackground}
        boxShadow={2}
        p={2}
        m={3}
        id="CP-7"
      >
        <Box m={3} p={2} display="flex" justifyContent="center">
          <Typography color="secondary" variant="h4">
            RUNTIME SECTION
          </Typography>
        </Box>
        <Box m={3} display="flex" justifyContent="center">
          <TextField
            type="number"
            variant="outlined"
            label="Add runtime (in ms)"
            className={classes.input}
            onChange={handleRuntimeChange}
            helperText="Runtime must be &lt; previous one"
            error={message.runtime}
          />
          <TextField
            type="number"
            variant="outlined"
            label="Add percentage of score (&le;100)"
            className={classes.input}
            onChange={handlePercentageChange}
            helperText="Percentage must be &lt; previous one"
            error={message.percentage}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button color="primary" variant="outlined" onClick={handleAddRuntime}>
            Add runtime
          </Button>
        </Box>
        <Box m={3} p={2} display="flex" flexWrap="wrap">
          {question.runtime.length === 0 ? (
            <Typography>Runtime is empty</Typography>
          ) : (
            question.runtime.map((item, index) => (
              <Chip
                onDelete={() => handleDeleteRuntime(index)}
                label={`<= ${item.runtime} ms (${item.percentage}%)`}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
            ))
          )}
        </Box>
      </Box>
      {isSaved ? (
        <Box
          display="flex"
          justifyContent="center"
          className={classes.whiteBackground}
          boxShadow={2}
          p={2}
          m={3}
          id="CP-8"
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={question.published}
                onChange={handleTickPublished}
                name="checkedA"
              />
            }
            label="Is published?"
          />
          <Tooltip title="When you publish, this question will be showed in Problems, and users can access to solve this problem without any permission.">
            <IconButton aria-label="delete">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null}
      <Box display="flex" justifyContent="center">
        <Typography className={classes.error}>{message.message}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" m={3} id="CP-9">
        <Button color="primary" variant="contained" onClick={handleClickSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className={classes.tabContent}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
