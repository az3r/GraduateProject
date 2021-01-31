import { Box, Button, Container, NativeSelect, Typography } from '@material-ui/core';
import React,{useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CodeEditor from '../CodeEditor';

export default function AddTestPage(props){
    const [testName,setTestName] = useState('');
    const [testIntro,setTestIntro] = useState('');
    const [language,setLanguage] = useState('csharp');
    const [code,setCode] = useState('');
    const [inputFile,setInputFile] = useState('');
    const [outputFile,setOutputFile] = useState('');


    const handleChangeTestName = (event,editor)=>{
        setTestName(editor.getData());
    }

    const handleChangeTestIntro = (event,editor)=>{
        setTestIntro(editor.getData());
    }

    const handleChangeLanguague = (e) => {
        setLanguage(e.target.value);
    }

    const handleOnChangeCode = (newCode) => {
        setCode(newCode);
    }

    const handleChangeInputFile = (e) => {
        setInputFile(e.target.files[0]);
    }

    const handleChangeOutputFile = (e) => {
        setOutputFile(e.target.files[0]);
    }

    const handleSubmitAddTest = (e) => {
        e.preventDefault();
        console.log(testName);
        console.log(testIntro);
        console.log(language);
        console.log(code);
        console.log(inputFile);
        console.log(outputFile);
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
                    <Typography variant={"h5"}>Choose programming language: </Typography>
                    <NativeSelect              
                        inputProps={{ 'aria-label': 'age' }}
                        onChange={handleChangeLanguague}>
                        <option value={"csharp"}>C#</option>
                        <option value={"java"}>Java</option>
                        <option value={"javascript"}>Javascript</option>
                    </NativeSelect>
                </Box>
                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Enter code: </Typography>
                    <CodeEditor language={language} onChange={handleOnChangeCode} ></CodeEditor>
                </Box>      

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Submit input file: </Typography>
                    <input type="file" name="inputFile" onChange={handleChangeInputFile}></input>
                </Box>  
                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant={"h5"}>Submit expected output file: </Typography>
                    <input type="file" name="outputFile" onChange={handleChangeOutputFile}></input>
                </Box>  
                <Button type="submit">Test</Button>     
                <Button type="submit">Submit</Button>      
            </form>   
        </Box>
    );
}