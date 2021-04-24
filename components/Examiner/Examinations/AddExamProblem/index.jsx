// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import {Box, Breadcrumbs, Button, Checkbox, Link, makeStyles, TextField, Typography} from '@material-ui/core';
// import React, {useEffect, useState} from 'react';
// import getTestCaseFromInputAndOutput, { formatQuestionsArray, getFormatResultFromFile } from '@libs/client/business';
// import { create } from '@libs/client/exams';
// import { FirebaseAuth } from '@libs/client/firebase';
// import { useRouter } from 'next/router';
// import { test } from '@libs/client/submissions';
// import Questions from './Questions/index';

// const useStyles = makeStyles({
//   textSuccess: {
//     color: '#52C41A',
//   },
//   textFail: {
//     color: '#F74B4D',
//   },
// });

// export default function AddTestPage({user}){
//     const router = useRouter();
//     useEffect(() => {
//         if(Object.keys(user).length === 0)
//         {
//         router.replace('/login');
//         }
//     },[]);
//     const [examIntro,setExamIntro] = useState({
//         isPrivate: false,
//         password: "",
//         title: "",
//         content: "",
//         start: "",
//         end: "",
//         message:{
//           password: false,
//           title: false,
//           content: false,
//           start: false,
//           end: false,
//         }
//     })
//     const [listOfQuestions,setListOfQuestions] = useState([]);
//     const [addMessage,setAddMessage] = useState({
//       isSuccess: false,
//       message: ""
//     });
//     const code = {
//     Csharp:
// `using System;
// class HelloWorld {
//     static void Main() {
//         Console.WriteLine("Hello World");
//     }
// }`,
//     Java: `import java.util.Scanner;
// public class Program
// {
//     public static void main(String[] args) {
//         System.out.println("Hello World");
//     }
// }`,
//     Python: `print("Hello world!")`,
//   };
//   const classes = useStyles();

//   const handleAddMultipleChoicesQuestion = () => {
//     const newMultipleChoicesQuestion = {
//       isMCQ: true,
//       question: '',
//       difficulty: 0,
//       score: 0,
//       minutes: 0,
//       seconds: 0,
//       a: '',
//       b: '',
//       c: '',
//       d: '',
//       correct: '',
//       message:{
//         question: false,
//         difficulty: false,
//         score: false,
//         minutes: false,
//         seconds: false,
//         a: false,
//         b: false,
//         c: false,
//         d: false,
//         correct: false,
//       }
//     };
//     setListOfQuestions([...listOfQuestions, newMultipleChoicesQuestion]);
//   };

//   const handleAddCodingProblemQuestion = () => {
//     const newCodingProblemQuestion = {
//       isMCQ: false,
//       title: '',
//       content: '',
//       difficulty: 0,
//       score: 0,
//       minutes: 0,
//       seconds: 0,
//       language: 'Csharp',
//       code: code.Csharp,
//       input: [],
//       simpleInput: '',
//       output: [],
//       simpleOutput: '',
//       cases: [],
//       messageTestCode: '',
//       testCodeSuccess: false,
//       isLoadingTestCode: false,
//       message:{
//         title: false,
//         content: false,
//         score: false,
//         time: false,
//         code: false,
//         input: false,
//         output: false,
//       }
//     };
//     setListOfQuestions([...listOfQuestions, newCodingProblemQuestion]);
//   };

//   const handleChangeExamPrivacy = (e) => {
//     setExamIntro({ ...examIntro, isPrivate: e.target.checked });
//   };

//   const handleChangeExamPassword = (e) => {
//     setExamIntro({ ...examIntro, 
//       password: e.target.value,
//       message: {   
//           ...examIntro.message,
//           password: false
//     }});
//     setAddMessage({...addMessage, 
//       isSuccess: false,
//       message: ""});
//   };

//   const handleChangeExamTitle = (e) => {
//     setExamIntro({ ...examIntro, 
//       title: e.target.value,
//       message: {   
//         ...examIntro.message,
//         title: false
//     }});
//     setAddMessage({...addMessage, 
//       isSuccess: false,
//       message: ""});
//   };

//   const handleChangeExamInfo = (event, editor) => {
//     setExamIntro({ ...examIntro,
//       content: editor.getData() ,
//       message: {   
//         ...examIntro.message,
//         content: false
//     }});
//     setAddMessage({...addMessage, 
//       isSuccess: false,
//       message: ""});
//   };

//   const handleChangeStartTime = (e) => {
//     setExamIntro({ ...examIntro, 
//       start: e.target.value,
//       message: {   
//         ...examIntro.message,start: false
//     }});
//     setAddMessage({...addMessage, 
//       isSuccess: false,
//       message: ""});
//   };

//   const handleChangeEndTime = (e) => {
//     setExamIntro({ ...examIntro, 
//       end: e.target.value,
//       message: {   
//         ...examIntro.message,end: false
//     }});
//     setAddMessage({...addMessage, 
//       isSuccess: false,
//       message: ""});
//   };

//   const handleChangeQuestionMC = (id, value) => {
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[id];
//     question.question = value;
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   // eslint-disable-next-line no-shadow
//   const handleChangeAnswerMC = (id, code, value) => {
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[id];
//     if (code === 'A') {
//       question.a = value;
//     }
//     if (code === 'B') {
//       question.b = value;
//     }
//     if (code === 'C') {
//       question.c = value;
//     }
//     if (code === 'D') {
//       question.d = value;
//     }
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   const handleChangeScore = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     // eslint-disable-next-line radix
//     question.score = parseInt(e.target.value);
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   const handleChangeMinutes = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     // eslint-disable-next-line radix
//     question.minutes = parseInt(e.target.value);
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   const handleChangeSeconds = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     // eslint-disable-next-line radix
//     question.seconds = parseInt(e.target.value);
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   const handleChangeCorrectAnswer = (e) => {
//     const {
//       id,
//     } = e.target.parentElement.parentElement.parentElement.parentElement;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     question.correct = e.target.value;
//     setListOfQuestions(newListQuestions);
//     setAddMessage({...addMessage,
//       isSuccess: false,
//       message: ""
//     });
//   };

//   const handleChangeCPTitle = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     question.title = e.target.value;
//     question.message = {...question.message, title: false};
//     setListOfQuestions(newListQuestions);
//   };

//   const handleChangeCPInfo = (id, value) => {
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[id];
//     question.content = value;
//     question.message = {...question.message, content: false};
//     setListOfQuestions(newListQuestions);
//   };

//   const handleChangeCPDifficulty = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     // eslint-disable-next-line radix
//     question.difficulty = parseInt(e.target.value);
//     setListOfQuestions(newListQuestions);
//   };

//   const handleChangeLanguague = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     question.language = e.target.value;
//     question.code = code[e.target.value];
//     setListOfQuestions(newListQuestions);
//   };

//   const handleChangeCPCode = (id, newCode) => {
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[id];
//     question.code = newCode;
//     question.message = {...question.message, code: false};
//     setListOfQuestions(newListQuestions);
//   };

//   const handleChangeCPFiles = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const fileType = split[2];
//     if (e.target.files[0] !== undefined) {
//       const fileReader = new FileReader();
//       // eslint-disable-next-line no-shadow
//       fileReader.onload = async (e) => {
//         const text = e.target.result;
//         const testCases = getFormatResultFromFile(text);
//         const newListQuestions = [...listOfQuestions];
//         const question = newListQuestions[questionID];

//         if (fileType === 'In') question.input = testCases;
//         else question.output = testCases;
//         question.cases = getTestCaseFromInputAndOutput(question.input,question.output);

//         setListOfQuestions(newListQuestions);
//       };
//       fileReader.readAsText(e.target.files[0]);
//     }
//   };

//   const handleChangeSimpleTest = (e) => {
//     const { id } = e.target;
//     const split = id.split('_');
//     const questionID = split[1];
//     const caseType = split[2];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     if (caseType === 'SimpleIn') question.simpleInput = e.target.value;
//     else question.simpleOutput = e.target.value;
//     setListOfQuestions(newListQuestions);
//   };

//   async function sendTestRequest(questionID) {
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     const cases = [
//       {
//         input: question.simpleInput,
//         output: question.simpleOutput,
//       },
//     ];

//     try {
//       const response = await test({
//         problemId: '',
//         problemName: '',
//         lang: question.language,
//         code: question.code,
//         testcases: cases,
//         save: false,
//       });
//       if (response.passed) {
//         question.testCodeSuccess = true;
//         question.messageTestCode = `Test passed!\nNow proceed with deleting answer in the code editor.\nThen, submiting input and output files with the same format as current simple test cases\n(Note: test cases in files must be devided by a blank line)`
//       } else if (response.failed === 1) {
//         question.testCodeSuccess = false;
//         question.messageTestCode = `Test failed!\nExpected output: ${response.results[0].expected}\nActual output: ${response.results[0].actual}`
//       }
//     } catch (error) {
//       question.testCodeSuccess = false;
//       question.messageTestCode = 'Error! Please check again';
//     } finally {
//       question.isLoadingTestCode = false;
//       setListOfQuestions(newListQuestions);
//     }
//   }

//   const handleTestCode = async (e) => {
//     const { id } = e.target.parentElement;
//     const split = id.split('_');
//     const questionID = split[1];
//     const newListQuestions = [...listOfQuestions];
//     const question = newListQuestions[questionID];
//     if (question.simpleInput === '' || question.simpleOutput === '') {
//       question.messageTestCode = 'Have not submited simple input or output yet';
//       setListOfQuestions(newListQuestions);
//       return;
//     }

//     question.isLoadingTestCode = true;
//     setListOfQuestions(newListQuestions);
//     await sendTestRequest(questionID);
//   };

//   const handleDeleteQuestion = (i) => {
//     const newListQuestions = [...listOfQuestions];
//     newListQuestions.splice(i,1)
//     setListOfQuestions(newListQuestions);
//   }

//   function validateExam()
//   {
//     if(examIntro.isPrivate && examIntro.password.length < 6)
//     {
//       setExamIntro({...examIntro, 
//         message: {   
//             ...examIntro.message,password: true
//         }});
//       setAddMessage({...addMessage, 
//         isSuccess: false,
//         message: "Password must at least 6 characters"});
//         return false;
//     }
//     if(examIntro.title === "")
//     {
//       setExamIntro({...examIntro, 
//         message: {   
//             ...examIntro.message,title: true
//         }});
//       setAddMessage({...addMessage, 
//         isSuccess: false,
//         message: "Enter examination title"});
//         return false;
//     }
//     if(examIntro.content === "")
//     {
//       setExamIntro({...examIntro, 
//         message: {   
//             ...examIntro.message,content: true
//         }});
//       setAddMessage({...addMessage, 
//         isSuccess: false,
//         message: "Enter examination content"});
//         return false;
//     }
//     if(examIntro.start === "")
//     {
//       setExamIntro({...examIntro, 
//         message: {   
//             ...examIntro.message,start: true
//         }});
//       setAddMessage({...addMessage, 
//         isSuccess: false,
//         message: "Enter examination start time"});
//         return false;
//     }
//     if(examIntro.end === "")
//     {
//       setExamIntro({...examIntro, 
//         message: {   
//             ...examIntro.message,end: true
//         }});
//       setAddMessage({...addMessage, 
//         isSuccess: false,
//         message: "Enter examination end time"});
//         return false;
//     }
//     return validateExamQuestions();
//   }

//   function validateExamQuestions(){
//     const newListQuestions = listOfQuestions;
//     // eslint-disable-next-line no-plusplus
//     for(let i = 0 ; i < newListQuestions.length ; i++)
//     {
//       const question = newListQuestions[i];
//       if(question.isMCQ)
//       {
//         if(question.question === "")
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter question content for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.score === 0 || Number.isNaN(question.score))
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter score for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         // eslint-disable-next-line use-isnan
//         if((question.minutes === 0 || Number.isNaN(question.minutes)) && (question.seconds === 0 || Number.isNaN(question.seconds)))
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter time for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.a === "")
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter answer A for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.b === "")
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter answer B for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.c === "")
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter answer C for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.d === "")
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           }
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter answer D for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.correct === "")
//         {
//           question.message = {
//             ...question.message,
//             correct: true
//           }
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter correct answer for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//       }
//       else
//       {
//         if(question.title === "")
//         {
//           question.message = {
//             ...question.message,
//             title: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter title for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.content === "")
//         {
//           question.message = {
//             ...question.message,
//             content: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter content for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.score === 0 || Number.isNaN(question.score))
//         {
//           question.message = {
//             ...question.message,
//             score: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter score for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         // eslint-disable-next-line use-isnan
//         if((question.minutes === 0 || Number.isNaN(question.minutes)) && (question.seconds === 0 || Number.isNaN(question.seconds)))
//         {
//           question.message = {
//             ...question.message,
//             question: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter time for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.code === "")
//         {
//           question.message = {
//             ...question.message,
//             code: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Enter code for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.input.length === 0)
//         {
//           question.message = {
//             ...question.message,
//             input: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Submit input file for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//         if(question.output.length === 0)
//         {
//           question.message = {
//             ...question.message,
//             output: true
//           };
//           setAddMessage({...addMessage,
//             isSuccess: false,
//             message: `Submit output file for question #${i+1}`
//           })
//           setListOfQuestions(newListQuestions);
//           return false;
//         }
//       }
//     }
//     return true;
//   }

//   const handleSubmitExam = async (e) => {
//     e.preventDefault();
//     const checkValidate = validateExam();
//     if(!checkValidate)
//     {
//       return;
//     }
//     const formatedQuestions = formatQuestionsArray(listOfQuestions);
//     const { uid } = FirebaseAuth().currentUser;
//     create(uid, {
//       title: examIntro.title,
//       content: examIntro.content,
//       isPrivate: examIntro.isPrivate,
//       password: examIntro.password,
//       startAt: examIntro.start,
//       endAt: examIntro.end,
//       problems: formatedQuestions,
//     });
//      setAddMessage({...addMessage,
//       isSuccess: true,
//       message: 'Add examination success'
//      });
//   };
    
//   return(
//     <Box m={1}>
//         <Box p={2}>
//             <Breadcrumbs>
//                 <Link color="inherit" href="/examiner">
//                     Examiner
//                 </Link>
//                 <Link color="inherit" href="/examiner/examinations">
//                     Examinations
//                 </Link>

//                 <Typography color="textPrimary">Add</Typography>
//             </Breadcrumbs>
//         </Box>
//         <form onSubmit={handleSubmitExam}>
//             <Box display="flex" justifyContent="center" m={3}>
//                 <Button color="secondary" variant="contained" onClick={handleAddMultipleChoicesQuestion}>
//                     Add multiple choices question
//                 </Button>
//                 <Button color="primary" variant="contained" onClick={handleAddCodingProblemQuestion}>
//                     Add coding problem question
//                 </Button>
//             </Box>

//             <Box boxShadow={1} p={2} m={3}>
//                 <Typography variant="h5">Is the exam private?: </Typography>
//                 <Checkbox
//                     checked={examIntro.isPrivate}
//                     onChange={handleChangeExamPrivacy}
//                 />
//                 {
//                     // eslint-disable-next-line no-nested-ternary
//                     examIntro.isPrivate ? 
//                       !examIntro.message.password ? 
//                         <TextField label="Password" onChange={handleChangeExamPassword} /> :
//                         <TextField label="Password" onChange={handleChangeExamPassword} 
//                         error
//                         helperText="Password must at least 6 characters"/>
//                     : 
//                     null
//                 }
//             </Box>

//             <Box boxShadow={1} p={2} m={3}>
//                 <Typography variant="h5">Enter exam title: </Typography>
//                 {
//                   !examIntro.message.title ?
//                   <TextField value={examIntro.title} fullWidth onChange={handleChangeExamTitle}/>
//                   :
//                   <TextField value={examIntro.title} fullWidth onChange={handleChangeExamTitle}
//                   error
//                   helperText="Enter examination title"/>


//                 }
//             </Box>

//             <Box boxShadow={1} p={2} m={3}>
//                 <Typography variant="h5">Enter exam content: </Typography>
//                 <CKEditor
//                     editor={ClassicEditor}
//                     data={examIntro.content}
//                     onChange={handleChangeExamInfo}
//                 />
//                 {
//                   examIntro.message.content?
//                   <Typography className={classes.textFail}>Enter exmination content</Typography> : null
//                 }
//             </Box>

//             <Box boxShadow={1} p={2} m={3}>
//                 <Typography variant="h5">Enter exam start time: </Typography>
//                 {
//                   !examIntro.message.start?
//                     <TextField
//                         type="datetime-local"
//                         onChange={handleChangeStartTime}
//                     />:
//                     <TextField
//                     type="datetime-local"
//                     onChange={handleChangeStartTime}
//                     error
//                     helperText="Enter examination start time"/>
//                 }
//             </Box>

//             <Box boxShadow={1} p={2} m={3}>
//                 <Typography variant="h5">Enter exam end time: </Typography>
//                 {
//                   !examIntro.message.end?
//                   <TextField
//                     type="datetime-local"
//                     onChange={handleChangeEndTime}         
//                   />:
//                   <TextField
//                     type="datetime-local"
//                     onChange={handleChangeEndTime}         
//                     error
//                     helperText="Enter examination end time"/>
//                 }
//             </Box>

            
//             <Questions listOfQuestions={listOfQuestions}
//                 handleChangeQuestionMC={handleChangeQuestionMC} handleChangeAnswerMC={handleChangeAnswerMC}
//                 handleChangeCorrectAnswer={handleChangeCorrectAnswer} handleChangeScore={handleChangeScore}
//                 handleChangeMinutes={handleChangeMinutes} handleChangeSeconds={handleChangeSeconds}
//                 handleDeleteQuestion={handleDeleteQuestion}

//                 handleChangeCPTitle={handleChangeCPTitle} handleChangeCPInfo={handleChangeCPInfo}
//                 handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeLanguague={handleChangeLanguague}
//                 handleChangeCPCode={handleChangeCPCode} handleChangeCPFiles={handleChangeCPFiles}
//                 handleChangeSimpleTest={handleChangeSimpleTest}
//                 handleTestCode={handleTestCode} />

//             <Box display="flex" justifyContent="center" m={3}>
//                 <Typography className={addMessage.isSuccess ? classes.textSuccess : classes.textFail}>{addMessage.message}</Typography>
//             </Box>

//             <Box display="flex" justifyContent="center" m={3}>
//                 <Button variant="contained" color="primary" type="submit">Add Exam</Button>
//             </Box>
//         </form>
//     </Box>
//   );
// }
