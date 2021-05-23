import { get } from '@libs/client/problems';
import {
  Box,
  Button,
  Chip,
  Divider,
  makeStyles,
  Slide,
  Typography,
} from '@material-ui/core';
import HTMLReactParser from 'html-react-parser';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getDifficultyString } from '@libs/client/business';
import CodeEditor from '@components/CodeEditor';

const useStyles = makeStyles((theme) => ({
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
}));

export default function QuestionInfo({ question, noLoadFromDB }) {
  const [problem, setProblem] = useState({});
  useEffect(async () => {
    if (question.id && !noLoadFromDB) {
      const problemData = await get({
        problemId: question.id,
      });
      setProblem(problemData);
    } else setProblem(question);
  }, [question]);

  return (
    <Box>
      {Object.keys(problem).length === 0 ? (
        <CircularProgress />
      ) : (
        <ShowInfoQuestionMCQ problem={problem} />
      )}
    </Box>
  );
}

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function ShowInfoQuestionMCQ({ problem }) {
  const [valueTab, setValueTab] = useState(0);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  return (
    <div style={{ clear: 'right' }}>
      <Typography>
        <b>Difficulty:</b> {getDifficultyString(problem.difficulty)}
      </Typography>
      <Typography>
        <b>Score:</b> {problem.score}
      </Typography>
      {!problem.isMCQ ? (
        <Typography>
          <b>Language:</b> {problem.language}
        </Typography>
      ) : null}
      <br />
      <Divider />
      <br />
      {problem.isMCQ ? (
        <>
          <Typography variant="h6">{HTMLReactParser(problem.title)}</Typography>
          <ol type="A">
            <li>{HTMLReactParser(problem.answers.A)}</li>
            <li>{HTMLReactParser(problem.answers.B)}</li>
            <li>{HTMLReactParser(problem.answers.C)}</li>
            <li>{HTMLReactParser(problem.answers.D)}</li>
          </ol>
          <Typography>
            <b>Correct:</b> {HTMLReactParser(problem.correctIndices)}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h6">{problem.title}</Typography>
          <div style={{ wordWrap: 'break-word' }}>
            {HTMLReactParser(problem.content)}
          </div>
          <Divider />
          <CodeEditor
            code={problem.code}
            language={problem.language}
            theme="xcode"
          />
          <br />
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
              <DialogContentText id="alert-dialog-slide-description">
                <div className={classes.root}>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={valueTab}
                    onChange={handleChangeTab}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                  >
                    {problem.cases.map((_, index) => (
                      <Tab
                        label={`Test case ${index + 1}`}
                        {...a11yProps(index)}
                      />
                    ))}
                  </Tabs>
                  {problem.cases.map((item, idx) => (
                    <TabPanel value={valueTab} index={idx}>
                      <Typography>Test case {idx + 1}:</Typography>
                      <pre>{`   {\n     input: ${item.input}\n     output: ${item.output}\n     score: ${item.score}\n   }`}</pre>
                    </TabPanel>
                  ))}
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <br />
          <br />
          <Divider />
          <br />
          <Box display="flex" flexWrap="wrap">
            {problem.runtime.map((item) => (
              <Chip
                label={`<= ${item.runtime} ms (${item.percentage}%)`}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
            ))}
          </Box>
        </>
      )}
    </div>
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
