export default function getTestCaseFromInputAndOutput(input, output) {
  let cases = [];
  for (let i = 0; i < input.length; i += 1) {
    cases = [
      ...cases,
      {
        input: input[i].join(' ').trim(),
        output: output[i].join(' ').trim(),
      },
    ];
  }

  return cases;
}

export function getFormatResultFromFile(text) {
  const splitedText = text.split('\r');
  let result = [];
  let arrayOfVariables = [];
  for (let i = 0; i < splitedText.length; i += 1) {
    if (splitedText[i] !== '\n') {
      arrayOfVariables = [...arrayOfVariables, splitedText[i]];
      if (i === splitedText.length - 1) {
        result = [...result, arrayOfVariables];
      }
    } else if (splitedText[i] === '\n') {
      result = [...result, arrayOfVariables];
      arrayOfVariables = [];
    }
  }
  return result;
}

export function formatQuestionsArray(questions) {
  const newQuestionList = questions.map((question) => {
    if (!question.IsMultipleChoices) {
      const newQuestion = {
        ...question,
        Cases: {
          input: question.Input,
          output: question.Output,
        },
      };
      delete newQuestion.Input;
      delete newQuestion.SimpleInput;
      delete newQuestion.Output;
      delete newQuestion.SimpleOutput;
      delete newQuestion.LoadingTestCode;
      delete newQuestion.MessageTestCode;
      delete newQuestion.TestCodeSuccess;
      delete newQuestion.IsLoadingTestCode;
      return newQuestion;
    }
    return question;
  });
  return newQuestionList;
}
