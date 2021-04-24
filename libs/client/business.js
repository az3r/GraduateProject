import emailjs from 'emailjs-com';
import { getInvitedDevelopers } from './exams';
import { getAll } from './developers';

export default function getTestCaseFromInputAndOutput(input, output, score) {
  let cases = [];
  for (let i = 0; i < input.length; i += 1) {
    cases = [
      ...cases,
      {
        input: input[i],
        output: output[i],
        score: Number(score[i]),
      },
    ];
  }

  return cases;
}

export function getInitialCode(language) {
  const code = {
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
    Python: `print("Hello World!")`,
  };

  return code[language];
}

export function getFormatResultFromFile(text) {
  const splitedText = text.split('\r');
  let result = [];
  let arrayOfVariables = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < splitedText.length; i++) {
    if (splitedText[i] !== '\n') {
      arrayOfVariables = [...arrayOfVariables, splitedText[i]];
      if (i === splitedText.length - 1) {
        result = [...result, arrayOfVariables.join(' ').trim()];
      }
    } else if (splitedText[i] === '\n') {
      result = [...result, arrayOfVariables.join(' ').trim()];
      arrayOfVariables = [];
    }
  }
  return result;
}

export function formatQuestionsArray(questions, isUpdateExam) {
  const newQuestionList = questions.map((question) => {
    if (!question.isMCQ) {
      const newQuestion = { ...question };
      if (!isUpdateExam) {
        newQuestion.cases = getTestCaseFromInputAndOutput(
          question.input,
          question.output
        );
      } else {
        // eslint-disable-next-line no-lonely-if
        if (newQuestion.input.length !== 0 && newQuestion.output.length !== 0) {
          newQuestion.cases = getTestCaseFromInputAndOutput(
            newQuestion.input,
            newQuestion.output
          );
        }
      }
      // const newQuestion = {
      //   ...question,
      //   cases: getTestCaseFromInputAndOutput(question.input, question.output),
      // };
      delete newQuestion.input;
      delete newQuestion.simpleInput;
      delete newQuestion.output;
      delete newQuestion.simpleOutput;
      delete newQuestion.messageTestCode;
      delete newQuestion.testCodeSuccess;
      delete newQuestion.isLoadingTestCode;
      delete newQuestion.message;
      return newQuestion;
    }
    const newQuestion = { ...question };
    delete newQuestion.message;
    return newQuestion;
  });
  return newQuestionList;
}

export function formatDuration(time) {
  // Hours, minutes and seconds
  // let hrs = ~~(time / 3600);
  const mins = (time % 3600) / 60;
  // let secs = ~~time % 60;

  // return `${hrs}h ${mins}m ${secs}s`;
  return `${mins} minutes`;
}

export async function getUsersForInvitation(examId) {
  const invitedUsers = await getInvitedDevelopers(examId);
  const usersDB = await getAll();
  const modifiedUsers = usersDB.map((value) => {
    const isInvited =
      invitedUsers.filter((invitedEmail) => invitedEmail === value.email)
        .length > 0 || false;
    return {
      id: value.id,
      avatar: value.avatar,
      name: value.name,
      email: value.email,
      isInvited,
    };
  });
  return modifiedUsers;
}

export function sendInvitation(
  toName,
  examinerName,
  examId,
  examPassword,
  sendTo
) {
  emailjs.send(
    'service_6zw4uj8',
    'template_nm4zffi',
    {
      to_name: toName,
      examiner_name: examinerName,
      exam_id: examId,
      exam_password: examPassword,
      send_to: sendTo,
    },
    'user_vdAvQzs8a2nH9TdfDiLcK'
  );
}
