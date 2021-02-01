

export default function createTestModel(title, language, input, output, content)
{
    let testData = {
        title: title,
        language: language,
        input: input,
        outputExpect: output,
        content : content
    }

    return testData
}