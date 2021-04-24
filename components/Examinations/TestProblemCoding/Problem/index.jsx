import React, { useEffect, useState } from 'react';
import { submissions } from '@libs/client';
import Box from '@material-ui/core/Box';
import {
  withStyles,
  Button,
  makeStyles,
  Tabs,
  Tab,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputBase,
  AppBar
} from '@material-ui/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CodeEditor from '@components/CodeEditor';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function TabPanel2(props) {
  const { children, value, index} = props;

  return (
    <div>
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}


const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
    flexGrow: 1,
  },
  controlBoard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50,
    marginLeft: 20,
    marginRight: 20
  },
  root2: {
    flexGrow: 1,
    backgroundColor: 'white',
    display: 'flex',
    height: 350,
  },
  tabs: {
    backgroundColor: 'lightgray',
    // borderRight: `1px solid black`,
  },
  compilerBox: {
    display: 'flex',
    justifyContent: 'flex-end',

  },
  submitCodeButton: {
    marginRight: 10,
  },
  runCodeButton: {
    color: 'black',
    backgroundColor: 'white',
    marginRight: 5,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.1em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
}));

const editorConfiguration = {
  toolbar: [ ],
};

export default function Problem({index, problem, user, onIsSolvedProblemsChange, onNextQuestion}) {
  const classes = useStyles();
  // const router = useRouter();

  const [code, setCode] = useState(problem.code);
  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const [displayWaiting, setDisplayWaiting] = useState("none");
  const [displayRunCode, setDisplayRunCode] = useState("none");
  const [runCodeStatus, setRunCodeStatus] = useState("Accepted");
  const [notification, setNotification] = useState("");
  const [runCodeResult, setRunCodeResult] = useState([]);
  const [theme, setTheme] = useState('xcode');
  const [size, setSize] = useState(14);

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  useEffect(() => {
    // Get code from localStorage
    const localStorageCode = localStorage.getItem(`${user.id}${index}Temporary`);
    if(localStorageCode != null){
      setCode(localStorageCode);
    }
  }, []);

  const handleCodeChange = (newCode) => {
    localStorage.setItem(`${user.id}${index}Temporary`, newCode);
    setCode(newCode);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  }

  const handleRunCode = async () => {
    setDisplayRunCode('none');
    setDisplayWaiting('block');
    try {
      const response = await submissions.test({
        lang: problem.language,
        code,
        testcases: problem.cases,
      });


      if (response.failed === 0) {
        setRunCodeResult(response.results);
        setRunCodeStatus("Accepted");
        setNotification("You have passed the sample test cases. Click the submit button to run your code against all the test cases.");
      } else {
        setRunCodeResult(response.results);
        setRunCodeStatus("Wrong Answer");
        setNotification(`${response.failed}/${response.results.length} test cases failed`);
      }
    } catch (e) {
      console.log(e);
      setRunCodeStatus("Compilation Error");
      setNotification("Check the compiler output, fix the error and try again.");
      setRunCodeResult(e);
    } finally {
      setDisplayWaiting('none');
      setDisplayRunCode('block');
    }

  };


  const handleSubmit = async () => {
    setDisplayWaiting('block');

    let response = null;
    let status = "";
    try {
      response = await submissions.test({
        lang: problem.language,
        code,
        testcases: problem.cases,
      });

      console.log(response);

      if (response.failed === 0) {
        status = "Accepted";
      } else {
        status = "Wrong Answer";
      }
    } catch (e) {
      status = "Compilation Error";
      response = e;
    } finally {
      setDisplayWaiting('none');
      setDisplayRunCode('block');

      // set IsSolvedProblems[index] = true;
      onIsSolvedProblemsChange(index);

      // save to LocalStorage
      const result = {
        // problemId: problem.id,
        // title: problem.title,
        isMCQ: false,
        status,
        details: {
          code,
          ...response
        }
      }
      localStorage.setItem(`${user.id}${index}`, JSON.stringify(result));

      onNextQuestion();
    }
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="transparent">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Problem" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Paper style={{paddingLeft: 20, paddingRight: 20}}>
            <CKEditor
              editor={ClassicEditor}
              disabled
              config={editorConfiguration}
              onReady={editor => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
                editor.editing.view.change(writer => {
                  writer.setStyle(
                    "border",
                    "0px",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              data={problem.content} />
          </Paper>
          <br />
          <br />
          <Box boxShadow={3}>
            <Box className={classes.controlBoard}>
              {/* <Box */}
              {/*  component="span" */}
              {/*  display="inline" */}
              {/*  p="8px" */}
              {/*  borderRadius={5} */}
              {/*  border={1} */}
              {/*  borderColor="green" */}
              {/*  bgcolor="#fafafa" */}
              {/*  style={{fontWeight: 'bolder', width: 100}} */}
              {/* > */}
              {/*  {problem.language} */}
              {/* </Box> */}
              <Box>
                <Select
                  style={{minWidth: 50, marginRight: 20}}
                  value={size}
                  onChange={handleSizeChange}
                  input={<BootstrapInput />}
                >
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={18}>18</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={28}>28</MenuItem>
                  <MenuItem value={32}>32</MenuItem>
                  <MenuItem value={40}>40</MenuItem>
                </Select>
                <Select
                  style={{minWidth: 150}}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={theme}
                  onChange={handleThemeChange}
                  input={<BootstrapInput />}
                >
                  <MenuItem value="xcode">Xcode</MenuItem>
                  <MenuItem value="monokai">Monokai</MenuItem>
                  <MenuItem value="github">Github</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="kuroir">Kuroir</MenuItem>
                  <MenuItem value="solarized_dark">Solarized Dark</MenuItem>
                  <MenuItem value="textmate">Textmate</MenuItem>
                  <MenuItem value="solarized_light">Solarized Light</MenuItem>
                  <MenuItem value="terminal">Terminal</MenuItem>
                  <MenuItem value="twilight">Twilight</MenuItem>
                </Select>
              </Box>
            </Box>
            <CodeEditor
              language={problem.language}
              code={code}
              onCodeChange={handleCodeChange}
              width="100%"
              height={450}
              size={size}
              theme={theme}
            />
          </Box>
          <br />
          <Box className={classes.compilerBox}>
            <Button
              size="large"
              type="submit"
              variant="outlined"
              onClick={handleRunCode}
              className={classes.runCodeButton}
            >
              Run Code
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="large"
              type="submit"
              onClick={handleSubmit}
              className={classes.submitCodeButton}
            >
              Submit Code
            </Button>
          </Box>

          <br />
          {/* Proccessing... */}
          <Box style={{display: displayWaiting}}>
            <Typography variant="h5" style={{paddingLeft: 30, fontWeight: 'bolder'}}>Processing...</Typography>
          </Box>

          {/* Run Code */}
          <Box style={{display: displayRunCode}}>
            <Paper style={{paddingLeft: 30, paddingTop: 10, paddingBottom: 10}}>
              {
                runCodeStatus === "Accepted" &&
                <Typography variant="h4" style={{fontWeight: 'bolder', color: 'green'}}>Congratulation!</Typography>
              }
              {
                runCodeStatus === "Wrong Answer" &&
                <Typography variant="h4" style={{fontWeight: 'bolder', color: 'red'}}>Wrong Answer :(</Typography>
              }
              {
                runCodeStatus === "Compilation Error" &&
                <Typography variant="h4" style={{fontWeight: 'bolder', color: 'red'}}>Compilation Error :(</Typography>
              }
            </Paper>
            <Box style={{marginTop: 10, color: 'gray'}}>{notification}</Box>
            <br />
            <Box boxShadow={3} className={classes.root2} >
              {
                (runCodeStatus === "Accepted" || runCodeStatus === "Wrong Answer") &&
                <>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value2}
                    onChange={handleChange2}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                    indicatorColor="primary"
                  >
                    {
                      runCodeResult.map((result, index1) => {
                        if(index1 === value2){
                          if(result.passed === false){
                            return (
                              <Tab icon={<CloseIcon />} label={`Sample Test case ${index1}`} style={{backgroundColor: 'white', color: 'red'}} />
                            )
                          }

                          return (
                            <Tab icon={<CheckIcon />} label={`Sample Test case ${index1}`} style={{backgroundColor: 'white', color: 'green'}} />
                          )

                        }

                        if(result.passed === false){
                          return (
                            <Tab icon={<CloseIcon />} label={`Sample Test case ${index1}`} style={{color: 'red'}} />
                          )
                        }

                        return (
                          <Tab icon={<CheckIcon />} label={`Sample Test case ${index1}`} style={{color: 'green'}} />
                        )


                      })
                    }
                  </Tabs>
                  {
                    runCodeResult.map((result, index2) => (
                      <TabPanel2 value={value2} index={index2}>
                        <Box style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 50, overflow: 'auto', maxHeight: 350, maxWidth: 800 }}>
                          {
                            result.passed === false &&
                            <>
                              <Typography variant="h6" style={{ color: 'gray' }}>Compiler Message</Typography>
                              <Typography style={{ marginLeft: 20, fontWeight: 'bolder' }}>Wrong Answer</Typography>
                              <br />
                              <Typography variant="h6" style={{ color: 'gray' }}>Input (stdin)</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.input}</Typography>
                              <br />
                              <Typography variant="h6" style={{ color: 'gray' }}>Your Output (stdout)</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.actual}</Typography>
                              <br />
                              <Typography variant="h6" style={{ color: 'gray' }}>Expected Output</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.expected}</Typography>
                              <br />
                            </>
                          }
                          {
                            result.passed === true &&
                            <>
                              <Typography variant="h6" style={{ color: 'gray' }}>Input (stdin)</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.input}</Typography>
                              <br />
                              <Typography variant="h6" style={{ color: 'gray' }}>Your Output (stdout)</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.input}</Typography>
                              <br />
                              <Typography variant="h6" style={{ color: 'gray' }}>Expected Output</Typography>
                              <Typography
                                style={{ marginLeft: 20, fontWeight: 'bolder' }}>{result.expected}</Typography>
                              <br />
                            </>
                          }
                        </Box>
                      </TabPanel2>
                    ))
                  }
                </>
              }
              {
                runCodeStatus === "Compilation Error" &&
                <Box style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
                  <Typography variant="h6" style={{color: 'gray'}}>Compiler Messages</Typography>
                  <Typography style={{marginLeft: 20, fontWeight: 'bolder'}}>{runCodeResult.status}</Typography>
                  <Typography style={{marginLeft: 20, fontWeight: 'bolder'}}>{runCodeResult.stderr}</Typography>
                  <Typography style={{marginLeft: 20, fontWeight: 'bolder'}}>{runCodeResult.stdout}</Typography>
                  <br />
                  <Typography variant="h6" style={{color: 'gray'}}>Exit Status</Typography>
                  <Typography style={{marginLeft: 20, fontWeight: 'bolder'}} >1</Typography>
                  <br />
                </Box>
              }
            </Box>
          </Box>
        </TabPanel>
      </div>
    </>
  );
}
