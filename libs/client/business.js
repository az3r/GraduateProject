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
