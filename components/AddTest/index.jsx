import { Box, Button, Container, Grid, NativeSelect, TextField, Typography } from '@material-ui/core';
import React,{useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CodeEditor from '../CodeEditor';
import { FormatAlignJustify, Score } from '@material-ui/icons';
import { split } from 'react-ace';

export default function AddTestPage(props){
    const [testName,setTestName] = useState('');
    const [testIntro,setTestIntro] = useState('');
    const [difficulty,setDifficulty] = useState(0);
    const [score,setScore] = useState(0);
    const [language,setLanguage] = useState('c_cpp');
    const [code,setCode] = useState({
    c_cpp: 
`#include <stdio.h>
int main()
{
    printf("Hello World");
    return 0;
}`,
    csharp: 
`using System;
class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
    java:
`public class Program
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    javascript:
`print('Hello World');`
        
    });
    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);
    const [message,setMessage] = useState('');
    const [simpleInput,setSimpleInput] = useState('');
    const [simpleOutput,setSimpleOutput] = useState('');


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
        if(language === "csharp")
         setCode({...code, csharp: newCode});
        if(language === "java")
            setCode({...code, java: newCode});
        if(language === "javascript")
            setCode({...code, javascript: newCode});
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
        if(testIntro === "" || testName === "" || input === [] || output === [])
        {
            setMessage("Not filling in sufficient information for the test");
            return;
        }
        if(input.length !== output.length)
        {
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
        console.log(cases);

        const response = await fetch("http://localhost:3000/api/text",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "title": testName,
                "content": testIntro,
                "difficulty": difficulty,
                "score": score,
                "language": language,
                "code": code[language],
                "cases": cases,
            })})
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
            alert("you have not submited simple input or output yet");
            return;
        }
        const response = await fetch("http://localhost:3000/api/testcode",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                
                "code": code[language],
                "language": language,
                "cases": {
                    input: simpleInput,
                    output: simpleOutput
                },
            })})
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
                        <option value={"c_cpp"}>C++</option>
                        <option value={"csharp"}>C#</option>
                        <option value={"java"}>Java</option>
                        <option value={"javascript"}>Javascript</option>
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
                                <li><Typography>Delete answer of your code</Typography></li>
                                <li><Typography>Submit the test</Typography></li>
                            </ul>

                            <div>
                                <TextField multiline label="Enter simple input" onChange={handleChangeSimpleInput}>
                                </TextField>
                            </div>
                            <div>
                                <TextField multiline label="Enter simple output" onChange={handleChangeSimpleOutput}>
                                </TextField>
                            </div>
                            
                            <Button variant="primary" onClick={handleTestCode}>Test code</Button>    
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
                <Typography>{message}</Typography>
                <Button type="submit">Submit</Button>      
            </form>   
        </Box>
    );
}