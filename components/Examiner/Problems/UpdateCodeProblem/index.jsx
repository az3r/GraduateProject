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
import { test } from '@libs/client/submissions';
import { useRouter } from 'next/router';
import { update } from '@libs/client/problems';
import CodeProblem from '../CodeProblem';
  
  const useStyles = makeStyles({
    textSuccess: {
      color: '#52C41A',
    },
    textFail: {
      color: '#F74B4D',
    },
  });
  
  export default function UpdateCodeProblem({user,problemProps}) {
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
      title: problemProps.title,
      content: problemProps.content,
      difficulty: problemProps.difficulty,
      score: problemProps.score,
      language: problemProps.language,
      code: problemProps.code,
      cases: problemProps.cases,
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
  
      if(input.length !== 0 && output.length === 0)
      {
        setMessage({...message, 
          output: false,
          addMessage: "Not submit output file"});
        return;
      } 
      if(output.length !== 0 && input.length === 0)
      {
        setMessage({...message, 
          input: false,
          addMessage: "Not submit input file"});
        return;
      } 
      if(input.length !== 0 && output.length !== 0)
      {
        const cases = getTestCaseFromInputAndOutput(input, output);
        problem.cases = cases;
      }
  
      const response = await update(problemProps.id, problem);
  
      if (response) {
        setIsAddSuccess(true);
        setMessage({...message, addMessage: 'Update problem success!'});
      } else {
        setIsAddSuccess(false);
        setMessage({...message, addMessage: 'Update problem failed due to server error. Please try again later'});
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
              <Link color="inherit"  href={`/examiner/problems/detail?id=${problemProps.id}`}>
                Detail
              </Link>
            <Typography color="textPrimary">Update</Typography>
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
          
          <Box p={2} m={3}>
            <Typography variant="h6">Once changing input or output file, examiner MUST submit the remaining file again.</Typography>
          </Box>
          <Box boxShadow={1} p={2} m={3}>
              <Typography variant="h5">Current test cases: </Typography>
              {problemProps.cases.map((item,key)=>(
                <Typography><b>#{key+1}:</b> input: {item.input} / output: {item.output}</Typography>
              ))}
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