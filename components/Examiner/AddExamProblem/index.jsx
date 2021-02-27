import {Box, Button} from '@material-ui/core';
import React,{useState} from 'react';
import Questions from './Questions';


export default function AddTestPage(props){
    const [listOfQuestions,setListOfQuestions] = useState([]);
    const [code,setCode] = useState({
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

    const handleAddMultipleChoicesQuestion = () => {
        const newMultipleChoicesQuestion = {
            IsMultipleChoices: true,
            Question: "",
            Score: 0,
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
            Language: "Csharp",
            Code: code["Csharp"],
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
        const id = e.target.id;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Score = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeCorrectAnswer = (e) => {
        const id = e.target.parentElement.parentElement.parentElement.parentElement.id;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Correct = e.target.value;
        setListOfQuestions(newListQuestions);
      };


    const handleChangeCPTitle = (e) => {
        const id = e.target.id;
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
        const id = e.target.id;
        const split = id.split("_");
        const questionID = split[1];
        const newListQuestions = [...listOfQuestions];
        const question = newListQuestions[questionID];
        question.Difficulty = e.target.value;
        setListOfQuestions(newListQuestions);
    }

    const handleChangeLanguague = (e) => {
        const id = e.target.id;
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
        const id = e.target.id;
        const split = id.split("_");
        const questionID = split[1];
        const fileType = split[2];
        if(e.target.files[0] !== undefined)
        {
            const fileReader = new FileReader();
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
        const id = e.target.id;
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
        const response = await fetch("/api/test-exam",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "userId": 1,
                "code": question.Code,
                "language": question.Language,
                "cases": [{
                    input: question.SimpleInput,
                    output: question.SimpleOutput
                }],
            })})

        if(response.status === 200)
        {
            const data = await response.json();
            if(data.results[0].passed)
            {
                question.TestCodeSuccess = true;
                question.MessageTestCode = "Test passed! Now proceed with deleting answer in the code editor .Then, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)";
            }
            else
            {       
                question.TestCodeSuccess = false;
                question.MessageTestCode = `Test failed! \nExpected output: ${  data.results[0].expected  }\n. Actual: ${  data.results[0].actual}`;
            }

        }
        else
        {           
            question.MessageTestCode = "Error! Please check again";
        }
        
        question.IsLoadingTestCode = false;
        setListOfQuestions(newListQuestions);
    }

    const handleTestCode = async (e) => {
        const id = e.target.parentElement.id;
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
        

    const handleSubmitExam = () =>{
        console.log(listOfQuestions);
        // const response = await fetch("/api/add-exam",{
        //     method: "POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type':'application/json'
        //     },
        //     body: JSON.stringify({
        //         "userId": 1,
        //         "exam": listOfQuestions
        //     })})

    }

    return(
        <Box m={1}>
            <Box display="flex" justifyContent="center" m={3}>
                <Button color="secondary" variant="contained" onClick={handleAddMultipleChoicesQuestion}>
                    Add multiple choices question
                </Button>
                <Button color="primary" variant="contained" onClick={handleAddCodingProblemQuestion}>
                    Add coding problem question
                </Button>
            </Box>
            
            <Questions listOfQuestions={listOfQuestions}
                handleChangeQuestionMC={handleChangeQuestionMC} handleChangeAnswerMC={handleChangeAnswerMC}
                handleChangeCorrectAnswer={handleChangeCorrectAnswer} handleChangeScore={handleChangeScore}

                handleChangeCPTitle={handleChangeCPTitle} handleChangeCPInfo={handleChangeCPInfo}
                handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeLanguague={handleChangeLanguague}
                handleChangeCPCode={handleChangeCPCode} handleChangeCPFiles={handleChangeCPFiles}
                handleChangeSimpleTest={handleChangeSimpleTest}
                handleTestCode={handleTestCode}>
            </Questions>
            <Box display="flex" justifyContent="center" m={3}>
                <Button variant="contained" color="primary" onClick={handleSubmitExam}>Add Exam</Button>

            </Box>
        </Box>
    );
}
