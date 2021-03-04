import {
  Box,
  Button,
  Grid,
  makeStyles,
  NativeSelect,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SkewLoader from 'react-spinners/SkewLoader';
import getTestCaseFromInputAndOutput, {
  getFormatResultFromFile,
} from '@libs/client/business';
import { create } from '@libs/client/problems';
import { test } from '@libs/client/codes';
import { FirebaseAuth } from '@libs/client/firebase';
import CodeEditor from '../../CodeEditor';

const useStyles = makeStyles({
  textSuccess: {
    color: '#52C41A',
  },
  textFail: {
    color: '#F74B4D',
  },
});

export default function AddProblemPage() {
  const code = {
    c_cpp: `#include <stdio.h>
int main()
{
    printf("Hello World");
    return 0;
}`,
    Csharp: `using System;
class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
    Java: `import java.util.Scanner;
public class Program
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    Python: `print("Hello world!")`,
  };
  const [problem, setProblem] = useState({
    title: '',
    content: '',
    difficulty: 0,
    score: 0,
    language: 'Csharp',
    code: code.Csharp,
    cases: [],
  });
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [message, setMessage] = useState('');
  const [simpleInput, setSimpleInput] = useState('');
  const [simpleOutput, setSimpleOutput] = useState('');
  const [testResponse, setTestReponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestSuccess, setIsTestSuccess] = useState(false);
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  const classes = useStyles();

  const handleChangeTestName = (event) => {
    setProblem({ ...problem, title: event.target.value });
  };

  const handleChangeTestIntro = (event, editor) => {
    setProblem({ ...problem, content: editor.getData() });
  };

  const handleChangeDifficulty = (event) => {
    setProblem({ ...problem, difficulty: event.target.value });
  };

  const handleChangeScore = (event) => {
    setProblem({ ...problem, score: event.target.value });
  };

  const handleChangeLanguague = (event) => {
    setProblem({ ...problem, language: event.target.value });
    setProblem({ ...problem, code: code[event.target.value] });
  };

  const handleOnChangeCode = (newCode) => {
    setProblem({ ...problem, code: newCode });
  };

  const handleChangeInputFile = (e) => {
    if (e.target.files[0] !== undefined) {
      const fileReader = new FileReader();
      fileReader.onload = async (reader) => {
        const text = reader.target.result;
        const testCases = getFormatResultFromFile(text);
        setInput(testCases);
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handleChangeOutputFile = (e) => {
    if (e.target.files[0] !== undefined) {
      const fileReader = new FileReader();
      fileReader.onload = async (reader) => {
        const text = reader.target.result;
        const expectedOutputs = getFormatResultFromFile(text);
        setOutput(expectedOutputs);
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handleSubmitAddProblem = async (e) => {
    e.preventDefault();
    if (!isTestSuccess) {
      setIsAddSuccess(false);
      setMessage('Exam has not tested with the passed result yet!');
      return;
    }

    const cases = getTestCaseFromInputAndOutput(input, output);
    setProblem({ ...problem, cases });

    if (problem.title === '' || problem.content === '' || problem.cases) {
      setIsAddSuccess(false);
      setMessage('Not filling in enough information for the test');
      return;
    }

    const { uid } = FirebaseAuth().currentUser;
    const response = create(uid, problem);

    if (response === true) {
      setIsAddSuccess(true);
      setMessage('Add test success!');
    } else {
      setIsAddSuccess(false);
      setMessage('Add test failed due to server error. Please try again later');
    }
  };

  const handleChangeSimpleInput = (e) => {
    setSimpleInput(e.target.value);
  };

  const handleChangeSimpleOutput = (e) => {
    setSimpleOutput(e.target.value);
  };

  const handleTestCode = async () => {
    if (simpleInput === '' || simpleOutput === '') {
      setTestReponse('Have not submited simple input or output yet');
      return;
    }
    setIsLoading(true);
    const cases = [
      {
        input: simpleInput,
        output: simpleOutput,
      },
    ];

    try {
      const response = await test({
        problemId: '',
        problemName: '',
        lang: problem.language,
        code: problem.code,
        testcases: cases,
        save: false,
      });
      if (response.passed) {
        setIsTestSuccess(true);
        setTestReponse(
          'Test passed! Now proceed with deleting answer in the code editor. Then, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)'
        );
      } else if (response.failed === 1) {
        setIsTestSuccess(false);
        setTestReponse(
          `Test failed! \nExpected output: ${response.results[0].expected}\n. Actual output: ${response.results[0].actual}`
        );
      }
    } catch (error) {
      setIsTestSuccess(false);
      setTestReponse('Error! Please check again');
    }
  };

  return (
    <Box m={1}>
      <form
        method="post"
        onSubmit={handleSubmitAddProblem}
        encType="multipart/form-data"
      >
        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Enter problem title: </Typography>
          <TextField onChange={handleChangeTestName} fullWidth />
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Enter problem information: </Typography>
          <CKEditor
            editor={ClassicEditor}
            data=""
            onChange={handleChangeTestIntro}
          />
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Choose level of difficulty: </Typography>
          <NativeSelect
            inputProps={{ 'aria-label': 'age' }}
            onChange={handleChangeDifficulty}
          >
            <option value={0}>Easy</option>
            <option value={1}>Medium</option>
            <option value={2}>Hard</option>
          </NativeSelect>
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Enter score: </Typography>
          <input
            onChange={handleChangeScore}
            type="number"
            max="100"
            min="0"
            value={problem.score}
          />
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Choose programming language: </Typography>
          <NativeSelect
            inputProps={{ 'aria-label': 'age' }}
            onChange={handleChangeLanguague}
          >
            {/* <option value={"c_cpp"}>C++</option> */}
            <option value="Csharp">C#</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </NativeSelect>
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Grid container>
            <Grid item lg={6}>
              <Typography variant="h5">Enter code: </Typography>
              <CodeEditor
                language={problem.language}
                code={problem.code}
                onCodeChange={handleOnChangeCode}
              />
            </Grid>
            <Grid item lg={6}>
              <Typography variant="h5">Notes:</Typography>
              <ul>
                <li>
                  <Typography>
                    Write full your code in the coding editor
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Enter simple input and output to test your code (include
                    only one test case)
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Click &quot;Test code&quot; button to test your code and
                    input, output
                  </Typography>
                </li>
              </ul>

              <div>
                <TextField
                  multiline
                  label="Enter simple input"
                  onChange={handleChangeSimpleInput}
                />
              </div>
              <div>
                <TextField
                  multiline
                  label="Enter simple output"
                  onChange={handleChangeSimpleOutput}
                />
              </div>
              <br />

              <div>
                <Button variant="primary" onClick={handleTestCode}>
                  Test code
                </Button>
                <SkewLoader color="#088247" loading={isLoading} size={20} />
              </div>
              <Typography
                className={
                  isTestSuccess ? classes.textSuccess : classes.textFail
                }
              >
                {testResponse}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Submit input file: </Typography>
          <input
            type="file"
            name="inputFile"
            onChange={handleChangeInputFile}
          />
        </Box>
        <Box boxShadow={1} p={2} m={3}>
          <Typography variant="h5">Submit expected output file: </Typography>
          <input
            type="file"
            name="outputFile"
            onChange={handleChangeOutputFile}
          />
        </Box>

        <Box
          variant="contained"
          display="flex"
          justifyContent="center"
          p={2}
          m={3}
        >
          <Typography
            className={isAddSuccess ? classes.textSuccess : classes.textFail}
          >
            {message}
          </Typography>
        </Box>

        <Box
          variant="contained"
          display="flex"
          justifyContent="center"
          boxShadow={1}
          p={2}
          m={3}
        >
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
