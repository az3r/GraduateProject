export default function getTestCaseFromInputAndOutput(input, output) {
  let cases = [];
  for (let i = 0; i < input.length; i += 1) {
    cases = [
      ...cases,
      {
        input: input[i],
        output: output[i],
      },
    ];
  }

  return cases;
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

export function formatQuestionsArray(questions) {
  const newQuestionList = questions.map((question) => {
    if (!question.isMCQ) {
      const newQuestion = {
        ...question,
        cases: getTestCaseFromInputAndOutput(question.input, question.output),
      };
      delete newQuestion.input;
      delete newQuestion.simpleInput;
      delete newQuestion.output;
      delete newQuestion.simpleOutput;
      delete newQuestion.loadingTestCode;
      delete newQuestion.messageTestCode;
      delete newQuestion.testCodeSuccess;
      delete newQuestion.isLoadingTestCode;
      return newQuestion;
    }
    return question;
  });
  return newQuestionList;
}
