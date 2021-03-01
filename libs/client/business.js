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
