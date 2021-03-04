import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Box, Button, Checkbox, TextField, Typography} from '@material-ui/core';
import React,{useState} from 'react';
import { test } from '@libs/client/codes';
import { formatQuestionsArray } from '@libs/client/business';
import { create } from '@libs/client/exams';
import { FirebaseAuth } from '@libs/client/firebase';
import Questions from './Questions/index';

export default function AddTestPage(){
    const [examIntro,setExamIntro] = useState({
        isPrivate: false,
        password: "",
        title: "",
        content: "",
        start: "",
        end: "",
    })
    const [listOfQuestions,setListOfQuestions] = useState([]);
    const code = {
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

    };

    const handleAddMultipleChoicesQuestion = () => {
        const newMultipleChoicesQuestion = {
            IsMultipleChoices: true,
            Question: "",
            Score: 0,
            Time: 0,
            A: "",
            B: "",
            C: "",
            D: "",
            Correct: ""
        }
        setListOfQuestions([...listOfQuestions,newMultipleChoicesQuestion]);
    }

    const handleAddCodingProblemQuestion = () => {
        const newCodingProblemQuestion = {
            IsMultipleChoices: false,
            Title: "",
            Content: "",
            Difficulty: 0,
            Score: 0,
            Time: 0,
            Language: "Csharp",
            Code: code.Csharp,
            Input: [],
            SimpleInput: '',
            Output: [],
            SimpleOutput: '',
            Cases: [],
            LoadingTestCode: false,
            MessageTestCode: '',
            TestCodeSuccess: false,
            IsLoadingTestCode: false,
        }
        setListOfQuestions([...listOfQuestions,newCodingProblemQuestion]);
    }

    const handleChangeQuestionMC = (id,value) => {
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[id];
        question.Question = value;
        setListOfQuestions(newListQuestions);
    }

    // eslint-disable-next-line no-shadow
    const handleChangeAnswerMC = (id,code,value) => {
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[id];
        if(code === 'A')
        {
            question.A = value;
        }
        if(code === 'B')
        {
            question.B = value;
        }
        if(code === 'C')
        {
            question.C = value;
        }
        if(code === 'D')
        {
            question.D = value;
        }
        setListOfQuestions(newListQuestions);
    }


    const handleChangeScore = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Score = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeTime = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Time = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeCorrectAnswer = (e) => {
        const {id} = e.target.parentElement.parentElement.parentElement.parentElement;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Correct = e.target.value;
        setListOfQuestions(newListQuestions);
      };


    const handleChangeCPTitle = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Title = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeCPInfo = (id,value) => {
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[id];
        question.Content = value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeCPDifficulty = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Difficulty = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeLanguague = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Language = e.target.value;
        question.Code = code[e.target.value];
        setListOfQuestions(newListQuestions);
    }

    const handleChangeCPCode = (id,newCode) => {
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[id];
        question.Code = newCode;
        setListOfQuestions(newListQuestions);
    }

    function getFormatResultFromFile(text){
        const splitedText = text.split("\r");
        let result = [];
        let arrayOfVariables = [];
        // eslint-disable-next-line no-plusplus
        for(let i = 0 ; i < splitedText.length ; i++)
        {
            if(splitedText[i] !== "\n")
            {
                arrayOfVariables = [...arrayOfVariables, splitedText[i]];
                if(i === splitedText.length - 1)
                {
                    result = [...result, arrayOfVariables.join(' ').trim()];
                }
            }
            else if(splitedText[i] === "\n")
            {
                result = [...result, arrayOfVariables.join(' ').trim()];
                arrayOfVariables = [];
            }
        }
        return result;
    }

    const handleChangeCPFiles = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const fileType = split[2];
        if(e.target.files[0] !== undefined)
        {
            const fileReader = new FileReader();
            // eslint-disable-next-line no-shadow
            fileReader.onload = async (e) => {
                const text = (e.target.result);
                const testCases = getFormatResultFromFile(text);
                const newListQuestions = [...listOfQuestions];
                const question = newListQuestions[questionID];
  
                if(fileType === "In")
                    question.Input = testCases;
                else
                    question.Output = testCases;

                setListOfQuestions(newListQuestions);
            };
            fileReader.readAsText(e.target.files[0])
        }
    }

    const handleChangeSimpleTest = (e) => {
        const {id} = e.target;
        const split = id.split("_");
        const questionID = split[1];
        const caseType = split[2];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        if(caseType === 'SimpleIn')
            question.SimpleInput = e.target.value;
        else
            question.SimpleOutput = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    async function sendTestRequest(questionID)
    {
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        const cases = [{
            input: question.SimpleInput,
            output: question.SimpleOutput
          }];
      
        try {
        const response = await test({
            problemId: "",
            problemName: "",
            lang: question.Language,
            code: question.Code,
            testcases: cases,
            save: false
        });
        if (response.passed) {
            question.TestCodeSuccess = true;
            question.MessageTestCode = 'Test passed! Now proceed with deleting answer in the code editor. Then, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)';
        } 
        else if(response.failed === 1) {
            question.TestCodeSuccess = false;
            question.MessageTestCode =  `Test failed! \nExpected output: ${response.results[0].expected}\n. Actual output: ${response.results[0].actual}`;
        } 
        } catch (error) {
            question.TestCodeSuccess = false;
            question.MessageTestCode = 'Error! Please check again';
        }
        finally{
            question.IsLoadingTestCode = false;
            setListOfQuestions(newListQuestions);
        }
    }

    const handleTestCode = async (e) => {
        const {id} = e.target.parentElement;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        if(question.SimpleInput === '' || question.SimpleOutput === '')
        {
            question.MessageTestCode = "Have not submited simple input or output yet" ;
            setListOfQuestions(newListQuestions);
            return;
        }

        question.IsLoadingTestCode = true;
        setListOfQuestions(newListQuestions);
        await sendTestRequest(questionID);
    }
        
    const handleChangeExamTitle = (e) => {
        setExamIntro({...examIntro, title: e.target.value});
    }

    const handleChangeExamInfo = (event,editor) => {
        setExamIntro({...examIntro, content: editor.getData()});
    }

    const handleChangeStartTime = (e) => {
        setExamIntro({...examIntro, start: e.target.value});
    }

    const handleChangeEndTime = (e) => {
        setExamIntro({...examIntro, end: e.target.value});
    }

    const handleChangeExamPrivacy = (e) => {
        setExamIntro({...examIntro, isPrivate: e.target.checked});
    }
    
    const handleChangeExamPassword = (e) => {
        setExamIntro({...examIntro, password: e.target.value});
    }

    const handleSubmitExam = async (e) =>{
        e.preventDefault();
        const formatedQuestions = formatQuestionsArray(listOfQuestions);
        const { uid } = FirebaseAuth().currentUser;
     
        create(uid,{
            title: examIntro.title,
            content: examIntro.content,
            isPrivate: examIntro.isPrivate,
            password: examIntro.password,
            startAt: examIntro.start,
            endAt: examIntro.end,
            problems: formatedQuestions
        });
    }
    
    return(
        <Box m={1}>
            <form onSubmit={handleSubmitExam}>
                <Box display="flex" justifyContent="center" m={3}>
                    <Button color="secondary" variant="contained" onClick={handleAddMultipleChoicesQuestion}>
                        Add multiple choices question
                    </Button>
                    <Button color="primary" variant="contained" onClick={handleAddCodingProblemQuestion}>
                        Add coding problem question
                    </Button>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Is the exam private?: </Typography>
                    <Checkbox
                        checked={examIntro.isPrivate}
                        onChange={handleChangeExamPrivacy}
                    />
                    {
                        examIntro.isPrivate ? 
                            <TextField label="Password" onChange={handleChangeExamPassword} /> : null
                    }
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Enter exam title: </Typography>
                    <TextField value={examIntro.title} fullWidth onChange={handleChangeExamTitle}/>
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Enter exam information: </Typography>
                    <CKEditor
                        editor={ClassicEditor}
                        data={examIntro.content}
                        onChange={handleChangeExamInfo}
                    />
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Enter exam start time: </Typography>
                    <TextField
                        type="datetime-local"
                        onChange={handleChangeStartTime}
                    />
                </Box>

                <Box boxShadow={1} p={2} m={3}>
                    <Typography variant="h5">Enter exam end time: </Typography>
                    <TextField
                        type="datetime-local"
                        onChange={handleChangeEndTime}
                    />
                </Box>

                
                <Questions listOfQuestions={listOfQuestions}
                    handleChangeQuestionMC={handleChangeQuestionMC} handleChangeAnswerMC={handleChangeAnswerMC}
                    handleChangeCorrectAnswer={handleChangeCorrectAnswer} handleChangeScore={handleChangeScore}
                    handleChangeTime={handleChangeTime}

                    handleChangeCPTitle={handleChangeCPTitle} handleChangeCPInfo={handleChangeCPInfo}
                    handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeLanguague={handleChangeLanguague}
                    handleChangeCPCode={handleChangeCPCode} handleChangeCPFiles={handleChangeCPFiles}
                    handleChangeSimpleTest={handleChangeSimpleTest}
                    handleTestCode={handleTestCode} />
                <Box display="flex" justifyContent="center" m={3}>
                    <Button variant="contained" color="primary" type="submit">Add Exam</Button>
                </Box>
            </form>
        </Box>
    );
}
