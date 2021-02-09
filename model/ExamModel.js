

export default function createTestModel(title, language, score, content, difficulty, code, cases)
{
    let testData = {
        title: title,
        language: language,
        content : content,
        difficulty: difficulty,
        code: code,
        cases: cases,
        score: score
    }

    return testData
}