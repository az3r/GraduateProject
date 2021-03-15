import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, {useEffect, useState } from 'react';
import getTestCaseFromInputAndOutput, {
  getFormatResultFromFile,
} from '@libs/client/business';
import { create } from '@libs/client/problems';
import { test } from '@libs/client/submissions';
import { FirebaseAuth } from '@libs/client/firebase';
import { useRouter } from 'next/router';
import CodeProblem from '../CodeProblem';

const useStyles = makeStyles({
  textSuccess: {
    color: '#52C41A',
  },
  textFail: {
    color: '#F74B4D',
  },
});

export default function AddProblemPage({user}) {
  const router = useRouter();
  useEffect(() => {
    if(Object.keys(user).length === 0)
    {
      router.replace('/login');
    }
  },[]);
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
  const [message, setMessage] = useState({
    title: true,
    content: true,
    score: true,
    testInput: true,
    testOutput: true,
    testMessage: "",
    input: true,
    output: true,
    addMessage: ""
  }
);
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [simpleInput, setSimpleInput] = useState('');
  const [simpleOutput, setSimpleOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestSuccess, setIsTestSuccess] = useState(false);
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  const classes = useStyles();

  const handleChangeTestName = (event) => {
    setMessage({...message, 
      title: true,
      addMessage: ""});
    setProblem({ ...problem, title: event.target.value });
  };

  const handleChangeTestIntro = (event, editor) => {
    setMessage({...message, content: true,
      addMessage: ""});
    setProblem({ ...problem, content: editor.getData() });
  };

  const handleChangeDifficulty = (event) => {
    setProblem({ ...problem, difficulty: event.target.value });
  };

  const handleChangeScore = (event) => {
    setProblem({ ...problem, score: event.target.value });
  };

  const handleChangeLanguague = (event) => {
    setProblem({
      ...problem,
      language: event.target.value,
      code: code[event.target.value],
    });
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
        setMessage({...message, input: true,
          addMessage: ""});

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
        setMessage({...message, output: true,
          addMessage: ""});

      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handleChangeSimpleInput = (e) => {
    setMessage({...message, testInput: true});
    setSimpleInput(e.target.value);
  };

  const handleChangeSimpleOutput = (e) => {
    setMessage({...message, testOutput: true});
    setSimpleOutput(e.target.value);
  };

  const handleTestCode = async () => {
    if (simpleInput === '') {
      setMessage({...message, testInput: false});
      return;
    }
    if (simpleOutput === '') {
      setMessage({...message, testOutput: false});
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
      if (response.passed === 1) {
        setIsTestSuccess(true);
        setMessage({...message, 
          testMessage: 'Test passed!\nNow proceed with deleting answer in the code editor.\nThen, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)',
          addMessage: ""
        });
      } else if (response.failed === 1) {
        setIsTestSuccess(false);
        setMessage({...message, 
          testMessage:`Test failed!\nExpected output: ${response.results[0].expected}\nActual output: ${response.results[0].actual}`
        });
      }
    } catch (error) {
      setIsTestSuccess(false);
      setMessage({...message, 
        testMessage:'Error! Please check again'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAddProblem = async (e) => {
    e.preventDefault();
    if(problem.title === "")
    {
      setMessage({...message, 
        title: false,
        addMessage: "Not enter title"});
      return;
    }
    if(problem.content === "")
    {
      setMessage({...message, 
        content: false,
        addMessage: "Not enter content"});
      return;
    }

    if (!isTestSuccess) {
      setIsAddSuccess(false);
      setMessage({...message, addMessage: 'Not tested with the passed result yet!'});
      return;
    }

    if(input.length === 0)
    {
      setMessage({...message, 
        input: false,
        addMessage: "Not submit input file"});
      return;
    } 

    if(output.length === 0)
    {
      setMessage({...message, 
        output: false,
        addMessage: "Not submit input file"});
      return;
    } 

    const cases = getTestCaseFromInputAndOutput(input, output);
    problem.cases = cases;

    const { uid } = FirebaseAuth().currentUser;
    const response = await create(uid, problem);

    if (response) {
      setIsAddSuccess(true);
      setMessage({...message, addMessage: 'Add test success!'});
    } else {
      setIsAddSuccess(false);
      setMessage({...message, addMessage: 'Add test failed due to server error. Please try again later'});
    }
  };

  return (
    <Box m={1}>
      <Box p={2}>
        <Breadcrumbs>
            <Link color="inherit" href="/examiner">
              Examiner
            </Link>
            <Link color="inherit"  href="/examiner/problems">
              Problems
            </Link>

          <Typography color="textPrimary">Add</Typography>
        </Breadcrumbs>
      </Box>
      <form
        method="post"
        onSubmit={handleSubmitAddProblem}
        encType="multipart/form-data"
      >
        <CodeProblem problem={problem} 
        handleChangeTestName={handleChangeTestName} handleChangeTestIntro={handleChangeTestIntro} 
        handleChangeDifficulty={handleChangeDifficulty} handleChangeScore={handleChangeScore}
        handleChangeLanguague={handleChangeLanguague}
        handleOnChangeCode={handleOnChangeCode} handleChangeSimpleInput={handleChangeSimpleInput}
        handleChangeSimpleOutput={handleChangeSimpleOutput} handleTestCode={handleTestCode}
        handleChangeInputFile={handleChangeInputFile} handleChangeOutputFile={handleChangeOutputFile}
        message={message} isLoading={isLoading} isTestSuccess={isTestSuccess}/>

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
            {message.addMessage}
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