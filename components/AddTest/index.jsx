import { Box, Button, Container, Grid, makeStyles, NativeSelect, TextField, Typography } from '@material-ui/core';
import React,{useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SkewLoader from "react-spinners/SkewLoader";
import CodeEditor from '../CodeEditor';
import URL from '../URL';


const useStyles = makeStyles({
    textSuccess: {
        color: '#52C41A'
    },
    textFail: {
        color: '#F74B4D'
    }
})

export default function AddTestPage(props){
    const [testName,setTestName] = useState('');
    const [testIntro,setTestIntro] = useState('');
    const [difficulty,setDifficulty] = useState(0);
    const [score,setScore] = useState(0);
    const [language,setLanguage] = useState('Csharp');
    const [code,setCode] = useState({
    c_cpp:
`#include <stdio.h>
int main()
{
    printf("Hello World");
    return 0;
}`,
    Csharp:
`using System;
class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
    Java:
`import java.util.Scanner;
public class Program
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    Python:
`print("Hello world!")`

    });
    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);
    const [message,setMessage] = useState('');
    const [simpleInput,setSimpleInput] = useState('');
    const [simpleOutput,setSimpleOutput] = useState('');
    const [testResponse,setTestReponse] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [isTestSuccess,setIsTestSuccess] = useState(false);
    const [isAddSuccess,setIsAddSuccess] = useState(false);
    const classes = useStyles();

    const handleChangeTestName = (event,editor)=>{
        setTestName(editor.getData());
    }

    const handleChangeTestIntro = (event,editor)=>{
        setTestIntro(editor.getData());
    }

    const handleChangeDifficulty = (e) => {
        setDifficulty(e.target.value);
    }

    const handleChangeScore = (e) => {
        setScore(e.target.value);
    }

    const handleChangeLanguague = (e) => {
        setLanguage(e.target.value);
    }

    const handleOnChangeCode = (newCode) => {
        if(language === "c_cpp")
            setCode({...code, c_cpp: newCode});
        if(language === "Csharp")
         setCode({...code, Csharp: newCode});
        if(language === "Java")
            setCode({...code, Java: newCode});
        if(language === "Python")
            setCode({...code, Python: newCode});
    }

    function getFormatResultFromFile(text){
        const splitedText = text.split("\r");
        let result = [];
        let arrayOfVariables = [];
        for(let i = 0 ; i < splitedText.length ; i++)
        {
            if(splitedText[i] !== "\n")
            {
                arrayOfVariables = [...arrayOfVariables, splitedText[i]];
                if(i === splitedText.length - 1)
                {
                    result = [...result, arrayOfVariables];
                }
            }
            else if(splitedText[i] === "\n")
            {
                result = [...result, arrayOfVariables];
                arrayOfVariables = [];
            }
        }
        return result;
    }


    const handleChangeInputFile = (e) => {
        if(e.target.files[0] !== undefined)
        {
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const text = (e.target.result);
                const testCases = getFormatResultFromFile(text);
                setInput(testCases);
            };
            fileReader.readAsText(e.target.files[0])
        }
    }

    const handleChangeOutputFile = (e) => {
        if(e.target.files[0] !== undefined)
        {
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const text = (e.target.result);
                const expectedOutputs = getFormatResultFromFile(text);
                setOutput(expectedOutputs);

            };
            fileReader.readAsText(e.target.files[0])
        }
    }

    const handleSubmitAddTest =  async (e) => {
        e.preventDefault();
        if(!isTestSuccess)
        {
            setIsAddSuccess(false);
            setMessage("Exam has not tested with the passed result yet!");
            return;
        }
        if(testIntro === "" || testName === "" || input === [] || output === [])
        {
            setIsAddSuccess(false);
            setMessage("Not filling in enough information for the test");
            return;
        }
        if(input.length !== output.length)
        {
            setIsAddSuccess(false);
            setMessage("Number of input and output not equal");
            return;
        }

        let cases = [];
        for(let i = 0 ; i < input.length ; i++)
        {
            cases = [...cases,
                {
                    input: input[i].join(" ").trim(),
                    output: output[i].join(" ").trim()
                }
            ]
        }

        const response = await fetch(URL.GetURL()+"add-test",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "userId": 1,
                "title": testName,
                "content": testIntro,
                "difficulty": difficulty,
                "score": score,
                "language": language,
                "code": code[language],
                "cases": cases,
            })})

        if(response.status === 200)
        {
            setIsAddSuccess(true);
            setMessage("Add test success!");
        }
        else
        {
            setIsAddSuccess(false);
            setMessage("Add test failed due to server error. Please try again later");
        }
    }

    const handleChangeSimpleInput = (e) => {
        setSimpleInput(e.target.value);
    }

    const handleChangeSimpleOutput = (e) => {
        setSimpleOutput(e.target.value);

    }

    const handleTestCode = async (e) => {
        if(simpleInput === '' || simpleOutput === '')
        {
            setTestReponse("Have not submited simple input or output yet");
            return;
        }
        setIsLoading(true);
        const response = await fetch(URL.GetURL()+"test-exam",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "userId": 1,
                "code": code[language],
                "language": language,
                "cases": [{
                    input: simpleInput,
                    output: simpleOutput
                }],
            })})

        setIsLoading(false);
        if(response.status === 200)
        {
            const data = await response.json();
            if(data.results[0].passed)
            {
                setIsTestSuccess(true);
                setTestReponse("Test passed! Now proceed with deleting answer in the code editor \nThen, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)");
            }
            else
            {
                setIsTestSuccess(false);
                setTestReponse("Test failed! \nExpected output: " + data.results[0].expected + "\nActual: " + data.results[0].actual);
            }

        }
        else
        {
            setIsTestSuccess(false);
            setTestReponse("Error! Please check again");
        }
    }

    return(
        <Box m={1}>
            <form method="post" onSubmit={handleSubmitAddTest} encType="multipart/form-data">
                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter test name: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data=""
                        onChange={handleChangeTestName}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter test information: </Typography>
                    <CKEditor
                        editor={ ClassicEditor }
                        data=""
                        onChange={handleChangeTestIntro}>
                    </CKEditor>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Choose level of difficulty: </Typography>
                    <NativeSelect
                        inputProps={{ 'aria-label': 'age' }}
                        onChange={handleChangeDifficulty}>
                        <option value={0}>Easy</option>
                        <option value={1}>Medium</option>
                        <option value={2}>Hard</option>
                    </NativeSelect>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter score: </Typography>
                    <input onChange={handleChangeScore} type="number" max="100" min="0" value={score}></input>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Choose programming language: </Typography>
                    <NativeSelect
                        inputProps={{ 'aria-label': 'age' }}
                        onChange={handleChangeLanguague}>
                        {/* <option value={"c_cpp"}>C++</option> */}
                        <option value={"Csharp"}>C#</option>
                        <option value={"Java"}>Java</option>
                        <option value={"Python"}>Python</option>
                    </NativeSelect>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Grid container>
                        <Grid item lg={6}>

                            <Typography variant={"h5"}>Enter code: </Typography>
                            <CodeEditor language={language}  code={code[language]} onChange={handleOnChangeCode} ></CodeEditor>

                        </Grid>
                        <Grid item lg={6}>
                            <Typography variant="h5">Notes:</Typography>
                            <ul>
                                <li><Typography>Write full your code in the coding editor</Typography></li>
                                <li><Typography>Enter simple input and output to test your code (include only one test case)</Typography></li>
                                <li><Typography>Click "Test code" button to test your code and input, output</Typography></li>
                            </ul>

                            <div>
                                <TextField multiline label="Enter simple input" onChange={handleChangeSimpleInput}>
                                </TextField>
                            </div>
                            <div>
                                <TextField multiline label="Enter simple output" onChange={handleChangeSimpleOutput}>
                                </TextField>
                            </div>
                            <br></br>

                            <div>
                            <Button variant="primary" onClick={handleTestCode}>Test code</Button>
                            <SkewLoader color={"#088247"}  loading={isLoading} size={20} />
                            </div>
                            <Typography className={isTestSuccess ? classes.textSuccess : classes.textFail}>{testResponse}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Submit input file: </Typography>
                    <input type="file" name="inputFile" onChange={handleChangeInputFile}></input>
                </Box>
                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Submit expected output file: </Typography>
                    <input type="file" name="outputFile" onChange={handleChangeOutputFile}></input>
                </Box>

                <Box variant="contained" display="flex" justifyContent="center" p={2} m={3}>
                    <Typography  className={isAddSuccess ? classes.textSuccess : classes.textFail}>{message}</Typography>

                </Box>

                <Box variant="contained" display="flex" justifyContent="center" boxShadow={1} p={2} m={3}>
                    <Button color="primary" type="submit">Submit</Button>
                </Box>
            </form>
        </Box>
    );
}
