import emailjs from 'emailjs-com';
// eslint-disable-next-line import/no-cycle
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

export function getDifficultyString(id) {
  switch (id) {
    case 0:
      return 'Easy';
    case 1:
      return 'Medium';
    case 2:
      return 'Hard';
    default:
      return '';
  }
}

export function formatDuration(time) {
  // Hours, minutes and seconds
  // let hrs = ~~(time / 3600);
  const mins = (time % 3600) / 60;
  // let secs = ~~time % 60;

  // return `${hrs}h ${mins}m ${secs}s`;
  return `${mins} minutes`;
}

export function formatTime(time) {
  // Hours, minutes and seconds
  const hrs = Math.floor(time / 3600, 10);
  const mins = Math.floor((time % 3600) / 60, 10);
  const secs = time % 60;

  return `${hrs}:${mins}:${secs}`;
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
  examTitle,
  sendTo
) {
  emailjs.send(
    'service_6zw4uj8',
    'template_nm4zffi',
    {
      to_name: toName,
      examiner_name: examinerName,
      exam_id: examId,
      exam_name: examTitle,
      send_to: sendTo,
    },
    'user_vdAvQzs8a2nH9TdfDiLcK'
  );
}

export function sendThanks(toName, fromName, title, toEmail, replyTo) {
  emailjs.send(
    'service_8iweofn',
    'template_32nlqql',
    {
      to_name: toName,
      from_name: fromName,
      title,
      time: new Date(Date.now()).toDateString(),
      to_email: toEmail,
      reply_to: replyTo,
    },
    'user_AU32qXM7LlBXkNew3IgHQ'
  );
}

export function getScoreOfCases(objects) {
  let score = 0;
  for (let i = 0; i < objects.length; i += 1) {
    score += objects[i].score;
  }
  return score;
}
